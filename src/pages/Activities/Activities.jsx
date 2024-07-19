import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Activity } from "../../models/activity/Activity";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

const columnClasses = {
  title: "max-w-40 overflow-hidden",
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
  entity: true,
};

/**
 * Activities page
 * @returns Activities page component
 */
function ActivitiesPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Activity(), [
      "id",
      "description",
      "dateOfCreation",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:activity.${key}.label`),
      className: columnClasses[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const activityQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Activities,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.Activity.getAll(sort.attribute, sort.order),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((activity) => {
      return {
        id: activity.id,
        lastUpdate: new Date(activity.lastUpdate).toLocaleDateString("es-ES"),
        deleted: activity.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary flex" to={`${activity.id}`}>
            <span className="w-80 truncate">{activity.title}</span>
          </Link>
        ),
        imageId: (
          <>
            {activity.imageId?.url ? (
              <img
                className={`w-10 h-10 rounded-full object-cover border-white border-2`}
                src={activity.imageId.url}
                alt={`${activity.title}`}
              />
            ) : (
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={noProduct}
                alt={activity.title}
              />
            )}
          </>
        ),
        entity:
          activity?.entity && activity?.entity?.length ? (
            <Link
              className="underline text-light-primary flex"
              to={`${activity?.entity?.split(",")[0]}s/${activity?.entity?.split(",")[1]}`}
            >
              <span className="w-80 truncate capitalize">{`${activity?.entity?.split(",")[0]} - ${activity?.entity?.split(",")[1]}`}</span>
            </Link>
          ) : (
            " - "
          ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = activityQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [activityQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/information/activities/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Activity.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.activity") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Activities] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">
        {t("_pages:information.links.activities")}
      </h1>
      <Table
        isLoading={activityQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default ActivitiesPage;

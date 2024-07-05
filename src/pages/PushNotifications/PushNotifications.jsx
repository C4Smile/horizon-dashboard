import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { PushNotification } from "../../models/pushNotification/PushNotification";

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
  action: true,
};

/**
 * PushNotification page
 * @returns PushNotification page component
 */
function PushNotifications() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new PushNotification(), ["id", "dateOfCreation", "deleted"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:pushNotification.${key}.label`),
      className: columnClasses[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const pushNotificationQuery = useQuery({
    queryKey: [
      ReactQueryKeys.PushNotifications,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.PushNotification.getAll(sort.attribute, sort.order),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((pushNotification) => {
      return {
        id: pushNotification.id,
        dateOfCreation: new Date(pushNotification.dateOfCreation).toLocaleDateString("es-ES"),
        lastUpdate: new Date(pushNotification.lastUpdate).toLocaleDateString("es-ES"),
        sentDate: new Date(pushNotification.sentDate).toLocaleDateString("es-ES"),
        deleted: pushNotification.deleted
          ? t("_accessibility:buttons.yes")
          : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary" to={`${pushNotification.id}`}>
            {pushNotification.title}
          </Link>
        ),
        imageId: (
          <>
            {pushNotification.imageId?.url ? (
              <img
                className={`w-10 h-10 rounded-full object-cover border-white border-2`}
                src={pushNotification.imageId.url}
                alt={`${pushNotification.title}`}
              />
            ) : (
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={noProduct}
                alt={pushNotification.title}
              />
            )}
          </>
        ),
        action:
          pushNotification?.entity && pushNotification?.entity?.length ? (
            <Link
              className="underline text-light-primary flex"
              to={`${pushNotification?.entity?.split(",")[0]}s/${pushNotification?.entity?.split(",")[1]}`}
            >
              <span className="w-80 truncate capitalize">{`${pushNotification?.entity?.split(",")[0]} - ${pushNotification?.entity?.split(",")[1]}`}</span>
            </Link>
          ) : (
            " - "
          ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = pushNotificationQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [pushNotificationQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/push-notifications/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.PushNotification.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.pushNotifications") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.PushNotifications] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">
        {t("_pages:management.links.pushNotifications")}
      </h1>
      <Table
        isLoading={pushNotificationQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default PushNotifications;

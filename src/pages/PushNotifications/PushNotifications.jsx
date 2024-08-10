import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { PushNotification } from "../../models/pushNotification/PushNotification";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { parents, ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

const columnClasses = {
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
  });

  const preparedRows = useMemo(
    () =>
      pushNotificationQuery.data?.map((pushNotification) => {
        let parsedAction = "-";
        const sAction = pushNotification?.action?.split(",");
        if (sAction?.length === 2)
          parsedAction = (
            <Link
              className="underline text-light-primary flex"
              to={`/${parents[sAction[0]]}/${sAction[0]}s/${sAction[1]}`}
            >
              <span className="truncate capitalize">{`${sAction[0]} - ${sAction[1]}`}</span>
            </Link>
          );
        else if (sAction?.length === 1)
          parsedAction = (
            <a
              href={`${sAction[0]}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-light-primary flex"
            >
              <span className="truncate capitalize">{`${sAction[0]}`}</span>
            </a>
          );

        return {
          ...pushNotification,
          sentDate: new Date(pushNotification.sentDate).toLocaleDateString("es-ES"),
          title: (
            <Link className="underline text-light-primary" to={`${pushNotification.id}`}>
              {pushNotification.title}
            </Link>
          ),
          imageId: pushNotification.imageId?.url ? (
            <img
              className={`w-10 h-10 rounded-full object-cover border-white border-2`}
              src={staticUrlPhoto(pushNotification.imageId.url)}
              alt={`${pushNotification.title}`}
            />
          ) : (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={noProduct}
              alt={pushNotification.title}
            />
          ),
          action: parsedAction,
        };
      }) ?? [],
    [pushNotificationQuery],
  );

  useEffect(() => {
    const { data } = pushNotificationQuery;
    if (data?.status && data?.status !== 200) {
      // eslint-disable-next-line no-console
      console.error(data.error.message);
      setNotification(String(data.status));
    }
  }, [pushNotificationQuery, navigate, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">
        {t("_pages:management.links.pushNotifications")}
      </h1>
      <Table
        isLoading={pushNotificationQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.PushNotification}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.PushNotifications}
        parent="management"
      />
    </div>
  );
}

export default PushNotifications;

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { PushNotification } from "../../models/pushNotification/PushNotification";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

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

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.PushNotifications, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () =>
      museumApiClient.PushNotification.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (pushNotification) => {
    let parsedAction = "-";
    const sAction = pushNotification?.action?.split(",");
    if (sAction?.length === 2)
      parsedAction = (
        <Link
          className="whitespace-nowrap underline text-light-primary flex"
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
        <Link className="whitespace-nowrap underline text-light-primary" to={`${pushNotification.id}`}>
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
  };

  const getActions = useActions({
    apiClient: museumApiClient.PushNotification,
    queryKey: ReactQueryKeys.PushNotifications,
    parent: "management",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      entity={PushNotification.className}
      columns={extractKeysFromObject(new PushNotification(), ["id", "dateOfCreation", "deleted"])}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:management.links.pushNotifications")}
    />
  );
}

export default PushNotifications;

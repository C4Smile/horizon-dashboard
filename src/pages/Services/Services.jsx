import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons

// dto
import { Service } from "../../models/service/Service";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { staticUrlPhoto } from "../../components/utils";

// components
import Table from "../../components/Table/Table";

const columnClasses = {
  name: "max-w-40 overflow-hidden",
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
  servicePlace: true,
};

/**
 * Services page
 * @returns Services page component
 */
function ServicesPage() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Service(), [
      "description",
      "dateOfCreation",
      "serviceRoom",
      "serviceHasSchedule",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:service.${key}.label`),
      className: columnClasses[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const serviceQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Services,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.Service.getAll(sort.attribute, sort.order),
  });

  const preparedRows = useMemo(
    () =>
      serviceQuery.data?.map((service) => ({
        ...service,
        name: (
          <Link className="underline text-light-primary flex" to={`${service.id}`}>
            <span className="w-80 truncate">{service.name}</span>
          </Link>
        ),
        imageId: service.imageId?.url ? (
          <img
            className={`w-10 h-10 rounded-full object-cover border-white border-2`}
            src={staticUrlPhoto(service.imageId.url)}
            alt={`${service.name}`}
          />
        ) : (
          <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={service.name} />
        ),
      })) ?? [],
    [serviceQuery],
  );

  useEffect(() => {
    const { data } = serviceQuery;
    if (data?.status && data?.status !== 200) {
      // eslint-disable-next-line no-console
      console.error(data.message);
      setNotification(String(data.status));
    }
  }, [serviceQuery, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.services")}</h1>
      <Table
        isLoading={serviceQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.Service}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.Services}
        parent="museum"
      />
    </div>
  );
}

export default ServicesPage;

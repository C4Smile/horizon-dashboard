import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Service } from "../../models/service/Service";

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

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Service(), [
      "id",
      "description",
      "dateOfCreation",
      "deleted",
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
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((service) => {
      return {
        id: service.id,
        lastUpdate: new Date(service.lastUpdate).toLocaleDateString("es-ES"),
        deleted: service.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary flex" to={`${service.id}`}>
            <span className="w-80 truncate">{service.name}</span>
          </Link>
        ),
        imageId: (
          <>
            {service.imageId?.url ? (
              <img
                className={`w-10 h-10 rounded-full object-cover border-white border-2`}
                src={service.imageId.url}
                alt={`${service.name}`}
              />
            ) : (
              <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={service.name} />
            )}
          </>
        ),
        servicePlace:
          service?.servicePlace && service?.servicePlace?.length ? (
            <Link
              className="underline text-light-primary flex"
              to={`/places/${service?.servicePlace?.placeId?.name}`}
            >
              <span className="w-80 truncate">{service?.servicePlace?.placeId?.name}</span>
            </Link>
          ) : (
            " - "
          ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = serviceQuery;
    if (data) {
      if (data.length === undefined && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.status) setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [serviceQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/museum/services/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Service.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.service") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Services] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.services")}</h1>
      <Table
        isLoading={serviceQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default ServicesPage;

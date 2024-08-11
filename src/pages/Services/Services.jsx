import { useEffect } from "react";
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

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// utils
import { staticUrlPhoto } from "../../components/utils";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

const columnClasses = {
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

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Services, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.Service.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (service) => ({
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
  });

  const getActions = useActions({
    apiClient: museumApiClient.Service,
    queryKey: ReactQueryKeys.Services,
    parent: "museum",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      columns={extractKeysFromObject(new Service(), [
        "description",
        "dateOfCreation",
        "serviceRoom",
        "serviceHasSchedule",
      ])}
      columnsOptions={{
        noSortableColumns,
        columnClasses,
      }}
      entity={Service.className}
      title={t("_pages:museum.links.services")}
    />
  );
}

export default ServicesPage;

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Resource } from "../../models/resource/Resource";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
};

/**
 * Resource page
 * @returns Resource page component
 */
function ResourcePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Resources, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Resource.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (resource) => {
    return {
      ...resource,
      name: (
        <Link className="underline text-light-primary flex" to={`${resource.id}`}>
          <span className="truncate">{resource.name}</span>
        </Link>
      ),
      imageId: resource.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(resource.image.url)}
          alt={`${resource.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={resource.name} />
      ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.Resource,
    queryKey: ReactQueryKeys.Resources,
    parent: Parents.game,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Resource(), ["id", "dateOfCreation", "deleted", "content"]),
    Resource.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Resource.className}
      columns={columns}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:game.links.resources")}
    />
  );
}

export default ResourcePage;

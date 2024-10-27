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

// components
import Chip from "../../components/Chip/Chip";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  resourceHasTag: true,
  resourceHasImage: true,
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
    queryKey: [ReactQueryKeys.Resource, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Resource.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (resource) => {
    return {
      ...resource,
      title: (
        <Link className="underline text-light-primary flex" to={`${resource.id}`}>
          <span className="truncate">{resource.title}</span>
        </Link>
      ),
      resourceHasTag:
        (
          <div className="flex flex-wrap gap-3">
            {resource.resourceHasTag?.map(({ tagId: tag }) => (
              <Chip key={tag?.id} label={tag?.name} spanClassName="text-xs" />
            ))}
          </div>
        ) ?? " - ",
      resourceHasImage:
        resource.resourceHasImage && resource.resourceHasImage.length ? (
          <div className="flex items-center justify-start">
            {resource.resourceHasImage.map((image, i) => (
              <img
                key={i}
                className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                src={staticUrlPhoto(image.imageId.url)}
                alt={`${resource.title} ${i}`}
              />
            ))}
          </div>
        ) : (
          <img className="small-image rounded-full object-cover" src={noProduct} alt={resource.title} />
        ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.Resource,
    queryKey: ReactQueryKeys.Resource,
    parent: Parents.resource,
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

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// dto
import { Resource } from "../../models/resource/Resource";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

/**
 * Resource page
 * @returns Resource page component
 */
function ResourcePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.Resources,
    queryFn: (data) => horizonApiClient.Resource.getAll(data),
  });

  const prepareRows = (resource) => {
    return {
      ...resource,
      name: (
        <Link className="underline text-light-primary flex" to={`${resource.id}`}>
          <span className="truncate">{resource.name}</span>
        </Link>
      ),
      baseFactor: {
        value: resource.baseFactor,
        render: `x ${resource.baseFactor}`,
      },
      image: resource.image?.url ? (
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

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Resources,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Resources,
    apiClient: horizonApiClient.Resource,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Resources,
    apiClient: horizonApiClient.Resource,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new Resource(), [
      "id",
      "dateOfCreation",
      "deleted",
      "description",
      "urlName",
    ]),
    Resource.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
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
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default ResourcePage;

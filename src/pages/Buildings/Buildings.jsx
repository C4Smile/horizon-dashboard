import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { staticUrlPhoto } from "../../components/utils";
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// dto
import { Building } from "../../models/building/Building";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";

// sitemap
import { findPath, pageId } from "../sitemap.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
  costs: true,
  produces: true,
  upkeeps: true,
  techRequirements: true,
};

/**
 * Building page
 * @returns Building page component
 */
function BuildingPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Buildings, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Building.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (building) => {
    return {
      ...building,
      name: (
        <Link className="underline text-light-primary flex" to={`${building.id}`}>
          <span className="truncate">{building.name}</span>
        </Link>
      ),
      creationTime: {
        value: building.creationTime,
        render: `${building.creationTime} ${t("_accessibility:labels.days")}`,
      },
      type: (
        <Link
          className="underline text-light-primary flex"
          to={`${findPath(pageId.buildingTypesEdit)}/${building.type?.id}`}
        >
          <span className="truncate">{building?.type?.name}</span>
        </Link>
      ),
      image: building.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(building.image.url)}
          alt={`${building.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={building.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Buildings,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Buildings,
    apiClient: horizonApiClient.Building,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Buildings,
    apiClient: horizonApiClient.Building,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  const { columns } = useParseColumns(
    extractKeysFromObject(new Building(), [
      "id",
      "dateOfCreation",
      "deleted",
      "description",
      "urlName",
    ]),
    Building.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={Building.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.buildings")}
      />

      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default BuildingPage;

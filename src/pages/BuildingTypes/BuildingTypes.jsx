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
import { BuildingType } from "../../models/buildingType/BuildingType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

/**
 * BuildingType page
 * @returns BuildingType page component
 */
function BuildingTypePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.BuildingTypes,
    queryFn: (data) => horizonApiClient.BuildingType.getAll(data),
  });

  const prepareRows = (buildingType) => {
    return {
      ...buildingType,
      name: (
        <Link className="underline text-light-primary flex" to={`${buildingType.id}`}>
          <span className="truncate">{buildingType.name}</span>
        </Link>
      ),
      image: buildingType.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(buildingType.image.url)}
          alt={`${buildingType.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={buildingType.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.BuildingTypes,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.BuildingTypes,
    apiClient: horizonApiClient.BuildingType,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.BuildingTypes,
    apiClient: horizonApiClient.BuildingType,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new BuildingType(), ["id", "dateOfCreation", "deleted", "urlName"]),
    BuildingType.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={BuildingType.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.buildingTypes")}
      />
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default BuildingTypePage;

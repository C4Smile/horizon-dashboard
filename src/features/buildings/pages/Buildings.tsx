import { useCallback, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard-app
import {
  ActionType,
  ConfirmationDialog,
  FilterTypes,
  Table,
} from "@sito/dashboard-app";

// lib
import { BuildingDto } from "../lib";

// icons

// components
import { TablePage, TableToolbar } from "components";

// utils
import { imageColumn, nameColumn, useParseColumns } from "utils";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { useBuildingTypesCommon } from "features/buildingTypes";
import { BuildingsQueryKeys, useBuildingsList } from "../hooks";

// sitemap
import { PageId } from "pages";

// api
import { EntityName, Tables } from "api";

/**
 * Building page
 * @returns Building page component
 */
function BuildingPage() {
  const { t } = useTranslation();

  //#region queries

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useBuildingsList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  const { data: buildingTypeList } = useBuildingTypesCommon();

  //#endregion queries

  //#region Actions

  const editAction = useEditAction({
    pageKey: PageId.buildings,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (ids) => horizonApiClient.Building.restore(ids),
    ...BuildingsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (ids) => horizonApiClient.Building.softDelete(ids),
    ...BuildingsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: BuildingDto): ActionType<BuildingDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<BuildingDto>(
    [
      nameColumn<BuildingDto>(),
      {
        key: "typeId",
        label: t("_entities:building.type.label"),
        filterOptions: {
          type: FilterTypes.autocomplete,
          options: buildingTypeList ?? [],
          defaultValue: [],
        },
        renderBody: (_: unknown, building: BuildingDto) => (
          <Link
            className={`underline ${building.deletedAt ? "text-fg-muted" : "text-primary"}`}
            to={`/game/${Tables.BuildingTypes}/${building.id}`}
          >
            {building.type.name}
          </Link>
        ),
      },
      imageColumn<BuildingDto>(),
    ],
    EntityName.Building,
    ["createdAt"],
  );

  return (
    <TablePage title={t("_pages:game.links.buildings")}>
      <ConfirmationDialog {...deleteAction}>
        <p>{t("_pages:common.actions.delete.dialog.message")}</p>
      </ConfirmationDialog>
      <ConfirmationDialog {...restoreAction}>
        <p>{t("_pages:common.actions.restore.dialog.message")}</p>
      </ConfirmationDialog>
      <Table
        data={data?.items ?? []}
        actions={getActions}
        isLoading={isLoading}
        entity={EntityName.Building}
        columns={columns}
        toolbar={<TableToolbar pageKey={PageId.buildings} />}
      />
    </TablePage>
  );
}

export default BuildingPage;

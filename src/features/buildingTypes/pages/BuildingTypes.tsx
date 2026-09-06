import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, Table } from "@sito/dashboard-app";

// components
import { TablePage, TableToolbar } from "components";

// utils
import { useParseColumns, nameColumn, imageColumn } from "utils";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { BuildingTypesQueryKeys, useBuildingTypesList } from "../hooks";

// pages
import { PageId } from "pages";

// lib
import { BuildingTypeDto } from "../lib";

// api
import { EntityName } from "api";

// providers
import { useHorizonApiClient } from "providers";

/**
 * RoomType page
 * @returns RoomType page component
 */
function BuildingTypes() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useBuildingTypesList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    pageKey: PageId.buildingTypes,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.BuildingType.restore(data),
    ...BuildingTypesQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.BuildingType.softDelete(data),
    ...BuildingTypesQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: BuildingTypeDto): ActionType<BuildingTypeDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<BuildingTypeDto>(
    [
      nameColumn<BuildingTypeDto>(),
      imageColumn<BuildingTypeDto>("name", "image"),
    ],
    EntityName.BuildingType,
    [],
  );

  return (
    <TablePage title={t("_pages:game.links.buildingTypes")}>
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
        columns={columns}
        entity={EntityName.BuildingType}
        toolbar={<TableToolbar pageKey={PageId.buildingTypes} />}
      />
    </TablePage>
  );
}

export default BuildingTypes;

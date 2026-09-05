import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, Table } from "@sito/dashboard-app";

// components
import { TablePage, TableToolbar } from "components";

// utils
import { useParseColumns, nameColumn, imageColumn } from "utils";

// hooks
import {
  useEditAction,
  TechTypesQueryKeys,
  useDeleteDialog,
  useRestoreDialog,
  useTechTypesList,
} from "hooks";

// pages
import { PageId } from "pages";

// lib
import { TechTypeDto } from "lib";

// api
import { EntityName, Tables } from "api";

// providers
import { useHorizonApiClient } from "providers";

/**
 * RoomType page
 * @returns RoomType page component
 */
function TechTypes() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useTechTypesList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.TechTypes}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.TechType.restore(data),
    ...TechTypesQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.TechType.softDelete(data),
    ...TechTypesQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: TechTypeDto): ActionType<TechTypeDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<TechTypeDto>(
    [nameColumn<TechTypeDto>(), imageColumn<TechTypeDto>("name", "image")],
    EntityName.TechType,
    [],
  );

  return (
    <TablePage
      title={t("_pages:game.links.techTypes")}
      pageKey={PageId.techTypes}
    >
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
        entity={EntityName.TechType}
        toolbar={<TableToolbar pageKey={PageId.techTypes} />}
      />
    </TablePage>
  );
}

export default TechTypes;

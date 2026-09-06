import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, FilterTypes, Table } from "@sito/dashboard-app";

// utils
import { nameColumn, useParseColumns } from "utils";

// components
import { TablePage, TableToolbar } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { useCannonsList, CannonsQueryKeys } from "../hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { CannonDto } from "../lib";

/**
 * Cannon page
 * @returns Cannon page component
 */
function CannonsPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useCannonsList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Cannons}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.Cannon.restore(data),
    ...CannonsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.Cannon.softDelete(data),
    ...CannonsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: CannonDto): ActionType<CannonDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<CannonDto>(
    [
      nameColumn<CannonDto>(),
      {
        key: "creationTime",
        filterOptions: { type: FilterTypes.number },
      },
    ],
    EntityName.Cannon,
    [],
  );

  return (
    <TablePage title={t("_pages:game.links.cannons")}>
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
        entity={EntityName.Cannon}
        toolbar={<TableToolbar pageKey={PageId.cannons} />}
      />
    </TablePage>
  );
}

export default CannonsPage;

import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  ActionType,
  ConfirmationDialog,
  FilterTypes,
  Table,
} from "@sito/dashboard-app";

// components
import { TablePage, TableToolbar } from "components";

// utils
import { useParseColumns, imageColumn, nameColumn } from "utils";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { NationsQueryKeys, useNationsList } from "../hooks";

// pages
import { PageId } from "pages";

// lib
import { NationDto } from "../lib";

// api
import { EntityName } from "api";

// providers
import { useHorizonApiClient } from "providers";

/**
 * Nations page
 * @returns Nations page component
 */
function Nations() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useNationsList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    pageKey: PageId.nations,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (ids) => horizonApiClient.Nation.restore(ids),
    ...NationsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (ids) => horizonApiClient.Nation.softDelete(ids),
    ...NationsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: NationDto): ActionType<NationDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<NationDto>(
    [
      nameColumn<NationDto>(),
      imageColumn<NationDto>("name", "image"),
      imageColumn<NationDto>("name", "icon"),
      {
        key: "playable",
        filterOptions: { type: FilterTypes.check, defaultValue: false },
        renderBody: (_: unknown, nation: NationDto) =>
          nation.playable
            ? t("_accessibility:buttons.yes")
            : t("_accessibility:buttons.no"),
      },
    ],
    EntityName.Nation,
    [],
  );

  return (
    <TablePage title={t("_pages:game.links.nations")}>
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
        entity={EntityName.Nation}
        toolbar={<TableToolbar pageKey={PageId.nations} />}
      />
    </TablePage>
  );
}

export default Nations;

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, Table } from "@sito/dashboard-app";

// utils
import { nameColumn, imageColumn, useParseColumns } from "utils";

// components
import { TablePage, TableToolbar } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { useSkillsList, SkillsQueryKeys } from "../hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { SkillDto } from "../lib";

/**
 * Skill page
 * @returns Skill page component
 */
function SkillsPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useSkillsList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Skills}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.Skill.restore(data),
    ...SkillsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.Skill.softDelete(data),
    ...SkillsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: SkillDto): ActionType<SkillDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<SkillDto>(
    [nameColumn<SkillDto>(), imageColumn<SkillDto>("name", "image")],
    EntityName.Skill,
    [],
  );

  return (
    <TablePage title={t("_pages:game.links.skills")}>
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
        entity={EntityName.Skill}
        toolbar={<TableToolbar pageKey={PageId.skills} />}
      />
    </TablePage>
  );
}

export default SkillsPage;

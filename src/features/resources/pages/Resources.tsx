import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, FilterTypes, Table } from "@sito/dashboard-app";

// utils
import { nameColumn, imageColumn, useParseColumns } from "utils";

// components
import { TablePage, TableToolbar } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import { useEditAction, useDeleteDialog, useRestoreDialog } from "hooks";
import { ResourcesQueryKeys, useResourcesList } from "../hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { ResourceDto } from "../lib";

/**
 * Resource page
 * @returns Resource page component
 */
function ResourcePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useResourcesList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Resources}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.Resource.restore(data),
    ...ResourcesQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.Resource.softDelete(data),
    ...ResourcesQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: ResourceDto): ActionType<ResourceDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<ResourceDto>(
    [
      nameColumn<ResourceDto>(),
      {
        key: "baseFactor",
        label: t("_entities:resource.baseFactor.label"),
        filterOptions: {
          type: FilterTypes.number,
        },
      },
      imageColumn<ResourceDto>("name", "image"),
      imageColumn<ResourceDto>("name", "icon"),
    ],
    EntityName.Resource,
    [],
  );

  return (
    <TablePage
      title={t("_pages:game.links.resources")}
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
        entity={EntityName.Resource}
        toolbar={<TableToolbar pageKey={PageId.resources} />}
      />
    </TablePage>
  );
}

export default ResourcePage;

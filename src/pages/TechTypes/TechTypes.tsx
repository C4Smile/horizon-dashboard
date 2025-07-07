import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action, Table } from "@sito/dashboard";

// components
import { TablePage, TableToolbar } from "components";

// utils
import { useParseColumns, nameColumn } from "utils";

// hooks
import {
  useEditAction,
  TechsQueryKeys,
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
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.TechTypes}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.Tech.restore(data),
    ...TechsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.Tech.softDelete(data),
    ...TechsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: TechTypeDto): Action<TechTypeDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction]
  );

  //#endregion Actions

  const { columns } = useParseColumns<TechTypeDto>(
    [nameColumn<TechTypeDto>()],
    EntityName.TechType,
    []
  );

  return (
    <TablePage
      title={t("_pages:game.links.techTypes")}
      pageKey={PageId.techTypes}
    >
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

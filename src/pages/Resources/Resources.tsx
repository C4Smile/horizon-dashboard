import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action, FilterTypes, Table } from "@sito/dashboard";

// utils
import { nameColumn, imageColumn, useParseColumns } from "utils";

// components
import { TablePage, TableToolbar } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import {
  useEditAction,
  TechsQueryKeys,
  useDeleteDialog,
  useRestoreDialog,
  useResourcesList,
} from "hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { ResourceDto } from "lib";

/**
 * Resource page
 * @returns Resource page component
 */
function ResourcePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useResourcesList();

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Resources}`,
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
    (row: ResourceDto): Action<ResourceDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction]
  );

  //#endregion Actions

  const { columns } = useParseColumns<ResourceDto>(
    [
      nameColumn<ResourceDto>(),
      {
        key: "baseFactor",
        label: t("_entities.resource.baseFactor.label"),
        filterOptions: {
          type: FilterTypes.number,
        },
      },
      imageColumn<ResourceDto>("name", "image"),
    ],
    EntityName.Resource,
    []
  );

  return (
    <TablePage
      title={t("_pages:game.links.resources")}
      pageKey={PageId.resources}
    >
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

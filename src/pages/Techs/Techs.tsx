import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard-app
import { ActionType, ConfirmationDialog, FilterTypes, Table } from "@sito/dashboard-app";

// components
import { TablePage, TableToolbar } from "components";

// providers
import { useHorizonApiClient } from "providers";

// hooks
import {
  useEditAction,
  TechsQueryKeys,
  useTechsList,
  useRestoreDialog,
  useDeleteDialog,
  useTechTypesCommon,
} from "hooks";

// sitemap
import { PageId } from "../sitemap";

// lib
import { TechDto } from "lib";

// api
import { EntityName, Tables } from "api";
import { imageColumn, nameColumn, useParseColumns } from "utils";

/**
 * Tech page
 * @returns Tech page component
 */
function TechPage() {
  const { t } = useTranslation();

  //#region queries

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useTechsList();

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const { data: techTypeList } = useTechTypesCommon();

  //#endregion queries

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Techs}`,
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
    (row: TechDto): ActionType<TechDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<TechDto>(
    [
      nameColumn<TechDto>(),
      {
        key: "typeId",
        label: t("_entities:tech.type.label"),
        filterOptions: {
          type: FilterTypes.autocomplete,
          options: techTypeList ?? [],
          defaultValue: [],
        },
        renderBody: (_: unknown, tech: TechDto) => (
          <Link
            className={`underline ${tech.deleted ? "text-white" : "text-light-primary"}`}
            to={`/game/${Tables.TechTypes}/${tech.id}`}
          >
            {tech.type.name}
          </Link>
        ),
      },
      imageColumn<TechDto>("name", "image"),
    ],
    EntityName.Tech,
    ["createdAt"],
  );

  return (
    <TablePage title={t("_pages:game.links.techs")} pageKey={PageId.techTypes}>
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
        entity={EntityName.Tech}
        columns={columns}
        toolbar={<TableToolbar pageKey={PageId.techs} />}
      />
    </TablePage>
  );
}

export default TechPage;

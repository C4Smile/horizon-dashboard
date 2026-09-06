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
import { useShipsList, ShipsQueryKeys } from "../hooks";

// api
import { EntityName, Tables } from "api";

// pages
import { PageId } from "pages";

// lib
import { ShipDto } from "../lib";

/**
 * Ship page
 * @returns Ship page component
 */
function ShipsPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading, setTotal } = useShipsList();

  useEffect(() => {
    if (data) setTotal(data.totalElements ?? 0);
  }, [data, setTotal]);

  //#region Actions

  const editAction = useEditAction({
    url: `game/${Tables.Ships}`,
  });

  const restoreAction = useRestoreDialog({
    mutationFn: (data) => horizonApiClient.Ship.restore(data),
    ...ShipsQueryKeys.all(),
  });

  const deleteAction = useDeleteDialog({
    mutationFn: (data) => horizonApiClient.Ship.softDelete(data),
    ...ShipsQueryKeys.all(),
  });

  const getActions = useCallback(
    (row: ShipDto): ActionType<ShipDto>[] => [
      editAction.action(row),
      restoreAction.action(row),
      deleteAction.action(row),
    ],
    [editAction, restoreAction, deleteAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns<ShipDto>(
    [
      nameColumn<ShipDto>(),
      {
        key: "capacity",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "hull",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "knots",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "minCrew",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "bestCrew",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "maxCrew",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "creationTime",
        filterOptions: { type: FilterTypes.number },
      },
      imageColumn<ShipDto>("name", "image"),
    ],
    EntityName.Ship,
    [],
  );

  return (
    <TablePage title={t("_pages:game.links.ships")}>
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
        entity={EntityName.Ship}
        toolbar={<TableToolbar pageKey={PageId.ships} />}
      />
    </TablePage>
  );
}

export default ShipsPage;

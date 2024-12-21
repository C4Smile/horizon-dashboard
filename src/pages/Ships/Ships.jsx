import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { staticUrlPhoto } from "../../components/utils";
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// dto
import { Ship } from "../../models/ship/Ship";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

const columnClasses = {
  lastUpdate: "w-44",
};

const noSortableColumns = {
  image: true,
  costs: true,
  upkeeps: true,
  techRequirements: true,
};

/**
 * Ship page
 * @returns Ship page component
 */
function ShipPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.Ships,
    queryFn: (data) => horizonApiClient.Ship.getAll(data),
  });

  const prepareRows = (ship) => {
    return {
      ...ship,
      capacity: {
        value: ship.capacity,
        render: (
          <span className="w-36 flex">{`${ship.capacity} ${t("_accessibility:labels.tons")}`}</span>
        ),
      },
      minCrew: {
        value: ship.minCrew,
        render: (
          <span className="w-36 flex">{`${ship.minCrew} ${t("_accessibility:labels.sailors")}`}</span>
        ),
      },
      bestCrew: {
        value: ship.bestCrew,
        render: (
          <span className="w-36 flex">{`${ship.bestCrew} ${t("_accessibility:labels.sailors")}`}</span>
        ),
      },
      maxCrew: {
        value: ship.maxCrew,
        render: (
          <span className="w-36 flex">{`${ship.maxCrew} ${t("_accessibility:labels.sailors")}`}</span>
        ),
      },
      knots: {
        value: ship.knots,
        render: `${ship.knots} ${t("_accessibility:labels.knots")}`,
      },
      creationTime: {
        value: ship.creationTime,
        render: `${ship.creationTime} ${t("_accessibility:labels.days")}`,
      },
      name: (
        <Link className="underline text-light-primary flex" to={`${ship.id}`}>
          <span className="truncate">{ship.name}</span>
        </Link>
      ),
      image: ship.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(ship.image.url)}
          alt={`${ship.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={ship.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Ships,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Ships,
    apiClient: horizonApiClient.Ship,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Ships,
    apiClient: horizonApiClient.Ship,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new Ship(), ["id", "dateOfCreation", "deleted", "description", "urlName"]),
    Ship.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={Ship.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.ships")}
      />

      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default ShipPage;

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

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
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";

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

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Ships, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Ship.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (ship) => {
    return {
      ...ship,
      capacity: {
        value: ship.capacity,
        render: (
          <span className="w-36 flex">{`${ship.capacity} ${t("_accessibility:labels.pounds")}`}</span>
        ),
      },
      crew: {
        value: ship.crew,
        render: (
          <span className="w-36 flex">{`${ship.crew} ${t("_accessibility:labels.sailors")}`}</span>
        ),
      },
      baseSpeed: {
        value: ship.baseSpeed,
        render: `${ship.baseSpeed} ${t("_accessibility:labels.knots")}`,
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

  const getActions = useActions({
    apiClient: horizonApiClient.Ship,
    queryKey: ReactQueryKeys.Ships,
    parent: Parents.game,
  });

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

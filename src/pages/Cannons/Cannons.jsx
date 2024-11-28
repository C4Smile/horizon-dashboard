import { useCallback, useEffect } from "react";
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
import { Cannon } from "../../models/cannon/Cannon";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";

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
 * Cannon page
 * @returns Cannon page component
 */
function CannonPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Cannons, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Cannon.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (cannon) => {
    return {
      ...cannon,
      weight: {
        value: cannon.weight,
        render: (
          <span className="w-36 flex">{`${cannon.weight} ${t("_accessibility:labels.tons")}`}</span>
        ),
      },
      baseDamage: {
        value: cannon.baseDamage,
        render: `${cannon.baseDamage}`,
      },
      creationTime: {
        value: cannon.creationTime,
        render: `${cannon.creationTime} ${t("_accessibility:labels.days")}`,
      },
      name: (
        <Link className="underline text-light-primary flex" to={`${cannon.id}`}>
          <span className="truncate">{cannon.name}</span>
        </Link>
      ),
      image: cannon.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(cannon.image.url)}
          alt={`${cannon.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={cannon.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Cannons,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Cannons,
    apiClient: horizonApiClient.Cannon,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Cannons,
    apiClient: horizonApiClient.Cannon,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new Cannon(), ["id", "dateOfCreation", "deleted", "description", "urlName"]),
    Cannon.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={Cannon.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.cannons")}
      />

      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default CannonPage;

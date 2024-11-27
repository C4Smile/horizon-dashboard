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

// dto
import { TechType } from "../../models/techType/TechType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

/**
 * TechType page
 * @returns TechType page component
 */
function TechTypePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.TechTypes, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.TechType.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (techType) => {
    return {
      ...techType,
      name: (
        <Link className="underline text-light-primary flex" to={`${techType.id}`}>
          <span className="truncate">{techType.name}</span>
        </Link>
      ),
      image: techType.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(techType.image.url)}
          alt={`${techType.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={techType.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.TechTypes,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.TechTypes,
    apiClient: horizonApiClient.TechType,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.TechTypes,
    apiClient: horizonApiClient.TechType,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new TechType(), ["id", "dateOfCreation", "deleted", "urlName"]),
    TechType.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={TechType.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.techTypes")}
      />
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default TechTypePage;

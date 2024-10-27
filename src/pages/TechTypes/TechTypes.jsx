import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// dto
import { TechType } from "../../models/techType/TechType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const columnClasses = {
  lastUpdate: "w-56",
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
    queryKey: [ReactQueryKeys.TechType, sortingBy, sortingOrder, currentPage, pageSize],
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
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.TechType,
    queryKey: ReactQueryKeys.TechTypes,
    parent: Parents.techType,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new TechType(), ["id", "dateOfCreation", "deleted", "content"]),
    TechType.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={TechType.className}
      columns={columns}
      columnsOptions={{ columnClasses }}
      title={t("_pages:game.links.techTypes")}
    />
  );
}

export default TechTypePage;

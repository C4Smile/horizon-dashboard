import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// dto
import { Tag } from "../../models/tag/Tag";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

/**
 * Tag page
 * @returns Tag page component
 */
function Tags() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Tags, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.Tag.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (row) => ({
    ...row,
    name: {
      value: row.name,
      render: (
        <Link className="whitespace-nowrap underline text-light-primary" to={`${row.id}`}>
          {row.name}
        </Link>
      ),
    },
  });

  const getActions = useActions({
    apiClient: museumApiClient.Tag,
    queryKey: ReactQueryKeys.Tags,
    parent: "information",
  });

  const { columns } = useParseColumns(extractKeysFromObject(new Tag(), []), Tag.className);

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Tag.className}
      columns={columns}
      title={t("_pages:information.links.tags")}
    />
  );
}

export default Tags;

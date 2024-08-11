import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// dto
import { Tag } from "../../models/tag/Tag";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

/**
 * Tag page
 * @returns Tag page component
 */
function Tags() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Tag(), []);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:tag.${key}.label`),
      className: "",
      sortable: true,
    }));
  }, [t]);

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

  return (
    <div className="p-5">
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={prepareRows}
        columns={preparedColumns}
        title={t("_pages:information.links.tags")}
      />
    </div>
  );
}

export default Tags;

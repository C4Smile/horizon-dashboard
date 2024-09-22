import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// dto
import { AppText } from "../../models/appText/AppText";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

/**
 * AppText page
 * @returns AppText page component
 */
function AppTexts() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.AppTexts, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.AppText.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (appText) => {
    return {
      ...appText,
      title: (
        <Link className="underline text-light-primary" to={`${appText.id}`}>
          {appText.title}
        </Link>
      ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.AppText,
    queryKey: ReactQueryKeys.AppTexts,
    parent: Parents.appTexts,
  });

  const { columns } = useParseColumns(extractKeysFromObject(new AppText(), ["id"]), AppText.className);

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={AppText.className}
      columns={columns}
      title={t("_pages:management.links.appTexts")}
    />
  );
}

export default AppTexts;

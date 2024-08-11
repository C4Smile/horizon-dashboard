import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// dto
import { AppText } from "../../models/appText/AppText";

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
    parent: "management",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      entity={AppText.className}
      columns={extractKeysFromObject(new AppText(), ["id"])}
      title={t("_pages:management.links.appTexts")}
    />
  );
}

export default AppTexts;

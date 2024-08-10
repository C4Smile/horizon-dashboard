import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// dto
import { AppText } from "../../models/appText/AppText";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * AppText page
 * @returns AppText page component
 */
function AppTexts() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new AppText(), ["id"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:appText.${key}.label`),
      className: "",
      sortable: true,
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const appTextQuery = useQuery({
    queryKey: [
      ReactQueryKeys.AppTexts,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.AppText.getAll(sort.attribute, sort.order),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((appText) => {
      return {
        ...appText,
        title: (
          <Link className="underline text-light-primary" to={`${appText.id}`}>
            {appText.title}
          </Link>
        ),
      };
    });
  }, [localData]);

  useEffect(() => {
    const { data } = appTextQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appTextQuery.data, navigate, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:management.links.appTexts")}</h1>
      <Table
        isLoading={appTextQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.AppText}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.AppTexts}
        parent="management"
      />
    </div>
  );
}

export default AppTexts;

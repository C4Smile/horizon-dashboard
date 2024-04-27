import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { News } from "../../models/news/News";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * News page
 * @returns News page component
 */
function NewsPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new News(), [
      "id",
      "description",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:news.${key}.label`),
      className: "",
    }));
  }, [t]);

  const newsQuery = useQuery({
    queryKey: [ReactQueryKeys.News],
    queryFn: () => museumApiClient.News.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((news) => {
      return {
        id: news.id,
        dateOfCreation: new Date(news.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(news.lastUpdate).toLocaleDateString(),
        deleted: news.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary" to={`${news.id}`}>
            {news.title}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = newsQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [newsQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/news/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.News.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.news") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.News] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.news")}
      </h1>
      <Table
        isLoading={newsQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default NewsPage;

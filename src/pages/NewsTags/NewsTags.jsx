import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { NewsTags } from "../../models/newsTags/NewsTags";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * NewsTags page
 * @returns NewsTags page component
 */
function NewsTagsPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new NewsTags(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:newsTags.${key}.label`),
      className: "",
    }));
  }, [t]);

  const newsTagsQuery = useQuery({
    queryKey: [ReactQueryKeys.NewsTags],
    queryFn: () => museumApiClient.NewsTags.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((newsTags) => {
      return {
        id: newsTags.id,
        dateOfCreation: new Date(newsTags.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(newsTags.lastUpdate).toLocaleDateString(),
        deleted: newsTags.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary" to={`${newsTags.id}`}>
            {newsTags.title}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = newsTagsQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [newsTagsQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/newsTags/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.NewsTags.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.newsTags") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.NewsTags] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.newsTags")}
      </h1>
      <Table
        isLoading={newsTagsQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default NewsTagsPage;

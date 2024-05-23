import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Tag } from "../../models/Tag/Tag";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Tags page
 * @returns Tags page component
 */
function TagsPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Tag(), ["id", "dateOfCreation", "lastUpdate", "deleted"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:tag.${key}.label`),
      className: "",
    }));
  }, [t]);

  const tagsQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags],
    queryFn: () => museumApiClient.Tags.getAll(),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((tags) => {
      return {
        id: tags.id,
        dateOfCreation: new Date(tags.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(tags.lastUpdate).toLocaleDateString(),
        deleted: tags.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary" to={`${tags.id}`}>
            {tags.name}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = tagsQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
      } else setLocalData(data ?? []);
    }
  }, [tagsQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/tags/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Tags.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.tag") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Tags] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.tags")}
      </h1>
      <Table
        isLoading={tagsQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default TagsPage;

import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// dto
import { Tag } from "../../models/tag/Tag";

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
 * Tag page
 * @returns Tag page component
 */
function Tags() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
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

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const tagQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Tags,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.Tag.getAll(sort.attribute, sort.order),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((tag) => {
      return {
        id: tag.id,
        dateOfCreation: {
          value: tag.dateOfCreation,
          render: new Date(tag.dateOfCreation).toLocaleDateString("es-ES"),
        },
        lastUpdate: {
          value: tag.lastUpdate,
          render: new Date(tag.lastUpdate).toLocaleDateString("es-ES"),
        },
        deleted: {
          value: tag.deleted,
          render: tag.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        },
        name: {
          value: tag.name,
          render: (
            <Link className="underline text-light-primary" to={`${tag.id}`}>
              {tag.name}
            </Link>
          ),
        },
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = tagQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [tagQuery, navigate, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:information.links.tags")}</h1>
      <Table
        isLoading={tagQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.Tag}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.Tags}
      />
    </div>
  );
}

export default Tags;

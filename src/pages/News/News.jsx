import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { News } from "../../models/news/News";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";
import Chip from "../../components/Chip/Chip";

const columnClasses = {
  title: "max-w-40 overflow-hidden",
  lastUpdate: "w-56",
};

const noSortableColumns = {
  newsHasTag: true,
  newsHasImage: true,
};

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
      "deleted",
      "content",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:news.${key}.label`),
      className: columnClasses[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const newsQuery = useQuery({
    queryKey: [
      ReactQueryKeys.News,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.News.getAll(sort.attribute, sort.order),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((news) => {
      return {
        id: news.id,
        lastUpdate: new Date(news.lastUpdate).toLocaleDateString("es-ES"),
        deleted: news.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary flex" to={`${news.id}`}>
            <span className="w-80 truncate">{news.title}</span>
          </Link>
        ),
        newsHasTag:
          (
            <div className="flex flex-wrap gap-3">
              {news.newsHasTag?.map((tag) => (
                <Chip key={tag?.tagId?.id} label={tag?.tagId?.name} spanClassName="text-xs" />
              ))}
            </div>
          ) ?? " - ",
        newsHasImage: (
          <>
            {news.newsHasImage && news.newsHasImage.length ? (
              <div className="flex items-center justify-start">
                {news.newsHasImage.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={image.imageId.url}
                    alt={`${news.title} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={news.title} />
            )}
          </>
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
      onClick: (e) => navigate(`/information/news/${e.id}`),
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
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:information.links.news")}</h1>
      <Table
        isLoading={newsQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default NewsPage;

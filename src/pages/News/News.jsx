import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { News } from "../../models/news/News";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";
import Chip from "../../components/Chip/Chip";

const columnClasses = {
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
  });

  const preparedRows = useMemo(() => {
    if (newsQuery.data) {
      const { data } = newsQuery;
      if (data && data !== null)
        return data.map((news) => {
          return {
            ...news,
            title: (
              <Link className="underline text-light-primary flex" to={`${news.id}`}>
                <span className="w-80 truncate">{news.title}</span>
              </Link>
            ),
            newsHasTag:
              (
                <div className="flex flex-wrap gap-3">
                  {news.newsHasTag?.map(({ tagId: tag }) => (
                    <Chip key={tag?.id} label={tag?.name} spanClassName="text-xs" />
                  ))}
                </div>
              ) ?? " - ",
            newsHasImage:
              news.newsHasImage && news.newsHasImage.length ? (
                <div className="flex items-center justify-start">
                  {news.newsHasImage.map((image, i) => (
                    <img
                      key={i}
                      className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                      src={staticUrlPhoto(image.imageId.url)}
                      alt={`${news.title} ${i}`}
                    />
                  ))}
                </div>
              ) : (
                <img
                  className="small-image rounded-full object-cover"
                  src={noProduct}
                  alt={news.title}
                />
              ),
          };
        });
    }
  }, [newsQuery]);

  useEffect(() => {
    const { data } = newsQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
  }, [newsQuery, navigate, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:information.links.news")}</h1>
      <Table
        isLoading={newsQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.News}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.News}
        parent="information"
      />
    </div>
  );
}

export default NewsPage;

import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { News } from "../../models/news/News";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";
import Chip from "../../components/Chip/Chip";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

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

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.News, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.News.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (news) => {
    return {
      ...news,
      title: (
        <Link className="underline text-light-primary flex" to={`${news.id}`}>
          <span className="truncate">{news.title}</span>
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
          <img className="small-image rounded-full object-cover" src={noProduct} alt={news.title} />
        ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.News,
    queryKey: ReactQueryKeys.News,
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
        title={t("_pages:information.links.news")}
      />
    </div>
  );
}

export default NewsPage;

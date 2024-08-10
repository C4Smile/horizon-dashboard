import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { GuestBook } from "../../models/guestBook/GuestBook";

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

const noSortableColumns = {
  guestBookHasImage: true,
};

/**
 * GuestBook page
 * @returns GuestBook page component
 */
function GuestBooks() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new GuestBook(), [
      "id",
      "dateOfCreation",
      "deleted",
      "content",
      "description",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:guestBook.${key}.label`),
      className: "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const guestBookQuery = useQuery({
    queryKey: [
      ReactQueryKeys.GuestBooks,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.GuestBook.getAll(sort.attribute, sort.order),
  });

  const preparedRows = useMemo(() => {
    if (guestBookQuery) {
      const { data } = guestBookQuery;
      if (data && data !== null)
        return data.map((guestBook) => {
          return {
            ...guestBook,
            date: new Date(guestBook.date).toLocaleDateString("es-ES"),
            name: (
              <Link className="underline text-light-primary" to={`${guestBook.id}`}>
                {guestBook.name}
              </Link>
            ),
            guestBookHasImage:
              guestBook.guestBookHasImage && guestBook.guestBookHasImage.length ? (
                <div className="flex items-center justify-start">
                  {guestBook.guestBookHasImage.map((image, i) => (
                    <img
                      key={i}
                      className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                      src={staticUrlPhoto(image.imageId.url)}
                      alt={`${guestBook.name} ${i}`}
                    />
                  ))}
                </div>
              ) : (
                <img
                  className="small-image rounded-full object-cover"
                  src={noProduct}
                  alt={guestBook.name}
                />
              ),
          };
        });
    }
  }, [guestBookQuery]);

  useEffect(() => {
    const { data } = guestBookQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
  }, [guestBookQuery, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.guestBooks")}</h1>
      <Table
        isLoading={guestBookQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.GuestBook}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.GuestBooks}
        parent="museum"
      />
    </div>
  );
}

export default GuestBooks;

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { GuestBook } from "../../models/guestBook/GuestBook";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const noSortableColumns = {
  guestBookHasImage: true,
};

/**
 * GuestBook page
 * @returns GuestBook page component
 */
function GuestBooks() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.GuestBooks, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.GuestBook.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });
  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (guestBook) => {
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
          <img className="small-image rounded-full object-cover" src={noProduct} alt={guestBook.name} />
        ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.GuestBook,
    queryKey: ReactQueryKeys.GuestBooks,
    parent: Parents.guestBooks,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new GuestBook(), [
      "id",
      "dateOfCreation",
      "deleted",
      "content",
      "description",
    ]),
    GuestBook.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={GuestBook.className}
      columns={columns}
      columnsOptions={{ noSortableColumns }}
      title={t("_pages:museum.links.guestBooks")}
    />
  );
}

export default GuestBooks;

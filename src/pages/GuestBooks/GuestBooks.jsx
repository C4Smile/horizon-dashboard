import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { GuestBook } from "../../models/guestBook/GuestBook";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

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

  const navigate = useNavigate();

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

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((guestBook) => {
      return {
        id: guestBook.id,
        lastUpdate: new Date(guestBook.lastUpdate).toLocaleDateString("es-ES"),
        deleted: guestBook.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        date: new Date(guestBook.date).toLocaleDateString("es-ES"),
        name: (
          <Link className="underline text-light-primary" to={`${guestBook.id}`}>
            {guestBook.name}
          </Link>
        ),
        guestBookHasImage: (
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
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = guestBookQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [guestBookQuery, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/museum/guest-books/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.Customer.delete([e.id]);
        setNotification(String(status), { model: t("_entities:entities.guestBook") });

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.GuestBooks] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.guestBooks")}</h1>
      <Table
        isLoading={guestBookQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        parent="museum"
      />
    </div>
  );
}

export default GuestBooks;

import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Room } from "../../models/room/Room";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

const noSortableColumns = {
  roomHasImage: true,
  image360Id: true,
};

/**
 * Room page
 * @returns Room page component
 */
function Rooms() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Room(), ["id", "dateOfCreation", "deleted", "content"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:room.${key}.label`),
      className: "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const roomQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Rooms,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.Room.getAll(sort.attribute, sort.order),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((room) => {
      return {
        id: room.id,
        lastUpdate: new Date(room.lastUpdate).toLocaleDateString("es-ES"),
        deleted: room.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        number: (
          <Link className="underline text-light-primary" to={`${room.id}`}>
            {room.number}
          </Link>
        ),
        type: (
          <Link className="underline text-light-primary" to={`/museum/room-types/${room.id}`}>
            {room.type.name}
          </Link>
        ),
        image360Id: (
          <>
            {room.image360Id?.url ? (
              <img
                className={`w-10 h-10 rounded-full object-cover border-white border-2`}
                src={room.image360Id.url}
                alt={`${room.number}`}
              />
            ) : (
              <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={room.number} />
            )}
          </>
        ),
        roomHasImage: (
          <>
            {room.roomHasImage && room.roomHasImage.length ? (
              <div className="flex items-center justify-start">
                {room.roomHasImage.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={image.imageId.url}
                    alt={`${room.name} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={room.name} />
            )}
          </>
        ),
        status: room.status.name,
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = roomQuery;
    if (data) {
      if (data.length === undefined && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.status) setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [roomQuery, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/museum/rooms/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.Customer.delete([e.id]);
        setNotification(String(status), { model: t("_entities:entities.room") });

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Rooms] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.rooms")}</h1>
      <Table
        isLoading={roomQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default Rooms;

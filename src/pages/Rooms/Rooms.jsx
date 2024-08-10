import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Room } from "../../models/room/Room";

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
  roomHasImage: true,
  roomHasImage360: true,
};

/**
 * Room page
 * @returns Room page component
 */
function Rooms() {
  const { t } = useTranslation();

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
  });

  const preparedRows = useMemo(() => {
    if (roomQuery.data) {
      const { data } = roomQuery;
      return data.map((room) => {
        return {
          ...room,
          name: (
            <Link className="underline text-light-primary" to={`${room.id}`}>
              {room.name}
            </Link>
          ),
          type: (
            <Link className="underline text-light-primary" to={`/museum/room-types/${room.id}`}>
              {room.type.name}
            </Link>
          ),
          roomHasImage360:
            room.roomHasImage360 && room.roomHasImage360.length ? (
              <div className="flex items-center justify-start">
                {room.roomHasImage360.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={staticUrlPhoto(image.imageId.url)}
                    alt={`${room.name} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img className="small-image rounded-full object-cover" src={noProduct} alt={room.title} />
            ),
          roomHasImage:
            room.roomHasImage && room.roomHasImage.length ? (
              <div className="flex items-center justify-start">
                {room.roomHasImage.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={staticUrlPhoto(image.imageId.url)}
                    alt={`${room.name} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img className="small-image rounded-full object-cover" src={noProduct} alt={room.title} />
            ),
          status: room.status.name,
        };
      });
    }
  }, [roomQuery]);

  useEffect(() => {
    const { data } = roomQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
  }, [roomQuery, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.rooms")}</h1>
      <Table
        isLoading={roomQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.Room}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.Rooms}
        parent="museum"
      />
    </div>
  );
}

export default Rooms;

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Room } from "../../models/room/Room";

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
  roomHasImage: true,
  roomHasImage360: true,
};

/**
 * Room page
 * @returns Room page component
 */
function Rooms() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Rooms, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.Room.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (room) => {
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
  };
  const getActions = useActions({
    apiClient: museumApiClient.Room,
    queryKey: ReactQueryKeys.Rooms,
    parent: Parents.room,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Room(), ["id", "dateOfCreation", "deleted", "content"]),
    Room.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Room.className}
      columns={columns}
      columnsOptions={{ noSortableColumns }}
      title={t("_pages:museum.links.rooms")}
    />
  );
}

export default Rooms;

import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { RoomArea } from "../../models/roomArea/RoomArea";

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
  roomAreaHasImage: true,
  roomAreaHasImage360: true,
  roomAreaImage: true,
};

/**
 * RoomArea page
 * @returns RoomArea page component
 */
function RoomAreas() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new RoomArea(), [
      "id",
      "dateOfCreation",
      "deleted",
      "content",
      "description",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:roomArea.${key}.label`),
      className: "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const roomAreaQuery = useQuery({
    queryKey: [
      ReactQueryKeys.RoomAreas,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.RoomArea.getAll(sort.attribute, sort.order),
  });

  const preparedRows = useMemo(() => {
    if (roomAreaQuery.data) {
      const { data } = roomAreaQuery;
      return data.map((roomArea) => {
        return {
          ...roomArea,
          name: (
            <Link className="underline text-light-primary" to={`${roomArea.id}`}>
              {roomArea.name}
            </Link>
          ),
          roomId: (
            <Link className="underline text-light-primary" to={`/museum/rooms/${roomArea.room?.id}`}>
              {roomArea.room?.name}
            </Link>
          ),
          roomAreaHasImage360:
            roomArea.roomAreaHasImage360 && roomArea.roomAreaHasImage360.length ? (
              <div className="flex items-center justify-start">
                {roomArea.roomAreaHasImage360.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={staticUrlPhoto(image.imageId.url)}
                    alt={`${roomArea.name} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img
                className="small-image rounded-full object-cover"
                src={noProduct}
                alt={roomArea.title}
              />
            ),
          roomAreaHasImage:
            roomArea.roomAreaHasImage && roomArea.roomAreaHasImage.length ? (
              <div className="flex items-center justify-start">
                {roomArea.roomAreaHasImage.map((image, i) => (
                  <img
                    key={i}
                    className={`w-10 h-10 rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={staticUrlPhoto(image.imageId.url)}
                    alt={`${roomArea.name} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img
                className="small-image rounded-full object-cover"
                src={noProduct}
                alt={roomArea.title}
              />
            ),
          status: roomArea.status.name,
        };
      });
    }
  }, [roomAreaQuery]);

  useEffect(() => {
    const { data } = roomAreaQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
  }, [roomAreaQuery, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.roomAreas")}</h1>
      <Table
        isLoading={roomAreaQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.RoomArea}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.RoomAreas}
        parent="museum"
      />
    </div>
  );
}

export default RoomAreas;

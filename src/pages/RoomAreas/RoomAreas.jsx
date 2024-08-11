import { useMemo, useEffect } from "react";
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
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

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

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.RoomAreas, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.RoomArea.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (roomArea) => {
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
          <img className="small-image rounded-full object-cover" src={noProduct} alt={roomArea.title} />
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
          <img className="small-image rounded-full object-cover" src={noProduct} alt={roomArea.title} />
        ),
      status: roomArea.status.name,
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.RoomArea,
    queryKey: ReactQueryKeys.RoomAreas,
    parent: "museum",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      columns={preparedColumns}
      title={t("_pages:museum.links.roomAreas")}
    />
  );
}

export default RoomAreas;

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

// dto
import { Room, RoomStatus } from "../../models/Room";
import { RoomType } from "../../models/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";

// components
import Table from "../../components/Table/Table";
import Loading from "../../partials/loading/Loading";

const roomQuery = [
  {
    id: 1,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: true,
    number: 101,
    type: new RoomType(1, "Single"),
    description: "Single bed with private bathroom",
    status: RoomStatus.free,
  },
  {
    id: 2,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    number: 102,
    type: new RoomType(2, "Double"),
    description: "Double bed with private bathroom",
    status: RoomStatus.occupied,
  },
];

/**
 * Room page
 * @returns Room page component
 */
function Rooms() {
  const { t } = useTranslation();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Room(), ["id", "dateOfCreation", "lastUpdate", "deleted"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:room.${key}.label`),
      className: "",
    }));
  }, [t]);

  const preparedRows = useMemo(() => {
    return roomQuery.map((room) => {
      return {
        id: room.id,
        dateOfCreation: new Date(room.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(room.lastUpdate).toLocaleDateString(),
        deleted: room.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        number: room.number,
        type: room.type.Name,
        description: room.description,
        status: t(`_entities:room.status.${room.status}`),
      };
    });
  }, [t]);

  const loading = useMemo(() => false, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.rooms")}
      </h1>
      {loading ? <Loading /> : <Table rows={preparedRows} columns={preparedColumns} />}
    </div>
  );
}

export default Rooms;

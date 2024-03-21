import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

// dto
import { RoomType } from "../../models/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";

// components
import Loading from "../../partials/loading/Loading";
import Table from "../../components/Table/Table";

const roomTypeQuery = [
  {
    id: 1,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: true,
    name: "Single",
    capacity: 1,
    price: 100,
  },
  {
    id: 2,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    name: "Double",
    capacity: 2,
    price: 200,
  },
];

/**
 * RoomTypes page
 * @returns RoomTypes page component
 */
function RoomTypes() {
  const { t } = useTranslation();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new RoomType(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({ id: key, label: t(`_entities:roomType.${key}.label`), className: "" }));
  }, [t]);

  const preparedRows = useMemo(() => {
    return roomTypeQuery.map((roomType) => {
      return {
        id: roomType.id,
        dateOfCreation: new Date(roomType.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(roomType.lastUpdate).toLocaleDateString(),
        deleted: roomType.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: roomType.name,
        capacity: roomType.capacity,
        price: roomType.price,
      };
    });
  }, [t]);

  const loading = useMemo(() => false, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.roomTypes")}
      </h1>
      {loading ? <Loading /> : <Table rows={preparedRows} columns={preparedColumns} />}
    </div>
  );
}

export default RoomTypes;

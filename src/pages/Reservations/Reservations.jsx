import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

// dto
import { Reservation, ReservationStatus } from "../../models/Reservation";

// utils
import { extractKeysFromObject } from "../../utils/parser";

// components
import Table from "../../components/Table/Table";
import Loading from "../../partials/loading/Loading";

const reservationQuery = [
  {
    id: 1,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    customer: { id: 1, name: "John Doe" },
    rooms: [],
    checkInDate: Date.now(),
    checkOutDate: Date.now(),
    status: ReservationStatus.pending,
    ticket: "ABC123456",
  },
  {
    id: 2,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    customer: { id: 1, name: "John Doe" },
    rooms: [],
    checkInDate: Date.now(),
    checkOutDate: Date.now(),
    status: ReservationStatus.confirmed,
    ticket: "ABC123456",
  },
  {
    id: 3,
    dateOfCreation: Date.now(),
    lastUpdate: Date.now(),
    deleted: false,
    customer: { id: 1, name: "John Doe" },
    rooms: [],
    checkInDate: Date.now(),
    checkOutDate: Date.now(),
    status: ReservationStatus.cancelled,
    ticket: "ABC123456",
  },
];

/**
 * Reservations page
 * @returns Reservations page component
 */
function Reservations() {
  const { t } = useTranslation();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Reservation(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:reservation.${key}.label`),
      className: "",
    }));
  }, [t]);

  const preparedRows = useMemo(() => {
    return reservationQuery.map((reservation) => {
      return {
        id: reservation.id,
        dateOfCreation: new Date(reservation.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(reservation.lastUpdate).toLocaleDateString(),
        deleted: reservation.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        customer: reservation.customer.name,
        rooms: reservation.rooms.length,
        checkInDate: new Date(reservation.checkInDate).toLocaleDateString(),
        checkOutDate: new Date(reservation.checkOutDate).toLocaleDateString(),
        status: t(`_entities:reservation.status.${ReservationStatus[reservation.status]}`),
        ticket: reservation.ticket,
      };
    });
  }, [t]);

  const loading = useMemo(() => false, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.reservations")}
      </h1>
      {loading ? <Loading /> : <Table rows={preparedRows} columns={preparedColumns} />}
    </div>
  );
}

export default Reservations;

import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Reservation } from "../../models/Reservation";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * Reservation page
 * @returns Reservation page component
 */
function Reservations() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

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

  const reservationQuery = useQuery({
    queryKey: [ReactQueryKeys.Reservations],
    queryFn: () => museumApiClient.reservation.getAll(),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((reservation) => {
      return {
        id: reservation.id,
        dateOfCreation: new Date(reservation.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(reservation.lastUpdate).toLocaleDateString(),
        deleted: reservation.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        number: reservation.number,
        name: (
          <Link className="underline text-light-primary" to={`${reservation.id}`}>
            {reservation.name}
          </Link>
        ),
        status: t(`_entities:reservation.status.${reservation.status}`),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { error } = reservationQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(reservationQuery.error);
  }, [reservationQuery]);

  useEffect(() => {
    const { data } = reservationQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.statusCode));
        if (data.statusCode === 401) navigate("/sign-out");
      } else setLocalData(data ?? []);
    }
  }, [reservationQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/reservations/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.Customer.delete([e.id]);
        setNotification(String(status));

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.reservations")}
      </h1>
      <Table
        isLoading={reservationQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Reservations;

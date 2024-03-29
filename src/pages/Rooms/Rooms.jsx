import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Room } from "../../models/Room";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

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
    const keys = extractKeysFromObject(new Room(), ["id", "dateOfCreation", "lastUpdate", "deleted"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:room.${key}.label`),
      className: "",
    }));
  }, [t]);

  const roomQuery = useQuery({
    queryKey: [ReactQueryKeys.Rooms],
    queryFn: () => museumApiClient.room.getAll(),
  });

  const preparedRows = useMemo(() => {
    return roomQuery.map((room) => {
      return {
        id: room.id,
        dateOfCreation: new Date(room.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(room.lastUpdate).toLocaleDateString(),
        deleted: room.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        number: room.number,
        name: (
          <Link className="underline text-light-primary" to={`${room.id}`}>
            {room.name}
          </Link>
        ),
        status: t(`_entities:room.status.${room.status}`),
      };
    });
  }, [roomQuery, t]);

  useEffect(() => {
    const { error } = roomQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(roomQuery.error);
  }, [roomQuery]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/management/rooms/${e.id}`),
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
      tooltip: t("_accessibility:buttons.edit"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.rooms")}
      </h1>
      <Table
        isLoading={roomQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
      />
    </div>
  );
}

export default Rooms;

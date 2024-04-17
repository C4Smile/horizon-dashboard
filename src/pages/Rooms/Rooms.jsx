import { useMemo, useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { Room } from "../../models/room/Room";
import { GenericFilter } from "../../models/query/GenericFilter";

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
    const keys = extractKeysFromObject(new Room(), [
      "id",
      "dateOfCreation",
      "lastUpdate",
      "deleted",
      "description",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:room.${key}.label`),
      className: "",
    }));
  }, [t]);

  const [pagingOptions, setPagingOptions] = useState(new GenericFilter());

  const onSortChange = useCallback(
    (attribute, sortingOrder) =>
      setPagingOptions({ ...pagingOptions, sortOrder: sortingOrder, orderBy: attribute }),
    [pagingOptions],
  );

  const roomQuery = useQuery({
    queryKey: [ReactQueryKeys.Rooms, pagingOptions],
    queryFn: () => museumApiClient.Room.getAll(GenericFilter.toQuery(pagingOptions)),
    retry: false,
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((room) => {
      return {
        id: room.id,
        dateOfCreation: new Date(room.dateOfCreation).toLocaleDateString(),
        lastUpdate: new Date(room.lastUpdate).toLocaleDateString(),
        deleted: room.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        number: room.number?.length ? room.number : t("_accessibility:labels.none"),
        name: (
          <Link className="underline text-light-primary" to={`${room.id}`}>
            {room.name}
          </Link>
        ),
        status: t(`_entities:room.status.${room.status}`),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = roomQuery;
    if (data) {
      if (data.length === undefined && data?.statusCode !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        if (data.statusCode) setNotification(String(data.statusCode));
        if (data.statusCode === 401) navigate("/sign-out");
      } else setLocalData(data ?? []);
    }
  }, [navigate, roomQuery, setNotification]);

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
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:management.links.rooms")}
      </h1>
      <Table
        isLoading={roomQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onSortChange}
      />
    </div>
  );
}

export default Rooms;

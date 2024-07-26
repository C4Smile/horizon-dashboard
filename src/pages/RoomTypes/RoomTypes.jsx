import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// dto
import { RoomType } from "../../models/roomType/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * RoomType page
 * @returns RoomType page component
 */
function RoomTypes() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new RoomType(), ["id", "dateOfCreation", "deleted"]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:roomType.${key}.label`),
      className: "",
      sortable: true,
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const roomTypeQuery = useQuery({
    queryKey: [
      ReactQueryKeys.RoomTypes,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.RoomType.getAll(sort.attribute, sort.order),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((roomType) => {
      return {
        id: roomType.id,
        lastUpdate: new Date(roomType.lastUpdate).toLocaleDateString("es-ES"),
        deleted: roomType.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        name: (
          <Link className="underline text-light-primary" to={`${roomType.id}`}>
            {roomType.name}
          </Link>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = roomTypeQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [roomTypeQuery, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/museum/room-types/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: (e) => {
        const { error, status } = museumApiClient.Customer.delete([e.id]);
        setNotification(String(status), { model: t("_entities:entities.roomType") });

        // eslint-disable-next-line no-console
        if (error && error !== null) console.error(error);
        else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.RoomTypes] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.roomTypes")}</h1>
      <Table
        isLoading={roomTypeQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default RoomTypes;

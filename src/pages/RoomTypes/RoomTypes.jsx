import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// dto
import { RoomType } from "../../models/roomType/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// components
import Table from "../../components/Table/Table";

/**
 * RoomType page
 * @returns RoomType page component
 */
function RoomTypes() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new RoomType(), []);
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

  const preparedRows = useMemo(() => {
    if (roomTypeQuery.data) {
      const { data } = roomTypeQuery;
      if (data && data !== null)
        return data.map((roomType) => {
          return {
            ...roomType,
            name: (
              <Link className="underline text-light-primary" to={`${roomType.id}`}>
                {roomType.name}
              </Link>
            ),
          };
        });
    }
  }, [roomTypeQuery]);

  useEffect(() => {
    const { data } = roomTypeQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      }
    }
  }, [roomTypeQuery, setNotification]);

  const getActions = [];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:museum.links.roomTypes")}</h1>
      <Table
        isLoading={roomTypeQuery.isLoading}
        rows={preparedRows}
        apiClient={museumApiClient.RoomType}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
        queryKey={ReactQueryKeys.RoomTypes}
        parent="museum"
      />
    </div>
  );
}

export default RoomTypes;

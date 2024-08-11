import React, { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// dto
import { RoomType } from "../../models/roomType/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

/**
 * RoomType page
 * @returns RoomType page component
 */
function RoomTypes() {
  const { t } = useTranslation();

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

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.RoomTypes, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.RoomType.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (roomType) => {
    return {
      ...roomType,
      name: (
        <Link className="underline text-light-primary" to={`${roomType.id}`}>
          {roomType.name}
        </Link>
      ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.RoomType,
    queryKey: ReactQueryKeys.RoomTypes,
    parent: "museum",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      columns={preparedColumns}
      title={t("_pages:museum.links.roomTypes")}
    />
  );
}

export default RoomTypes;

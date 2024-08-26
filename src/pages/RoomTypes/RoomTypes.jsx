import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// dto
import { RoomType } from "../../models/roomType/RoomType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

/**
 * RoomType page
 * @returns RoomType page component
 */
function RoomTypes() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

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

  const { columns } = useParseColumns(extractKeysFromObject(new RoomType(), []));

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={RoomType.className}
      columns={columns}
      title={t("_pages:museum.links.roomTypes")}
    />
  );
}

export default RoomTypes;

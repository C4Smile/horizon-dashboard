import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult } from "./types.ts";

// lib
import { ShipDto, ShipCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const ShipsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Ships],
  }),
  list: () => ({
    queryKey: [...ShipsQueryKeys.all().queryKey, "list"],
  }),
  common: () => ({
    queryKey: [...ShipsQueryKeys.all().queryKey, "common"],
  }),
};

export function useShipsList(): ApiQueryResult<ShipDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Ship.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...ShipsQueryKeys.list(),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useShipsCommon(): UseQueryResult<ShipCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...ShipsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Ship.commonGet({
        deleted: false,
      }),
  });
}

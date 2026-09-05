import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions, withTotal } from "./types.ts";

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
  list: (options?: TableQueryOptions) => ({
    queryKey: [...ShipsQueryKeys.all().queryKey, "list", options ?? {}],
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
      horizonApiClient.Ship.get(
        {
          sortingBy: sortingBy as keyof ShipDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...ShipsQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useShipsCommon(): UseQueryResult<ShipCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...ShipsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Ship.commonGet({
        deletedAt: null,
      }),
  });
}

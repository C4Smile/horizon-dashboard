import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult } from "./types.ts";

// lib
import { BuildingDto, BuildingCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const BuildingsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Buildings],
  }),
  list: () => ({
    queryKey: [...BuildingsQueryKeys.all().queryKey, "list"],
  }),
  common: () => ({
    queryKey: [...BuildingsQueryKeys.all().queryKey, "common"],
  }),
};

export function useBuildingsList(): ApiQueryResult<BuildingDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Building.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...BuildingsQueryKeys.list(),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useBuildingsCommon(): UseQueryResult<BuildingCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...BuildingsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Building.commonGet({
        deleted: false,
      }),
  });
}

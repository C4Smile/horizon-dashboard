import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions } from "./types.ts";

// lib
import { BuildingTypeDto, BuildingTypeCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const BuildingTypesQueryKeys = {
  all: () => ({
    queryKey: [Tables.BuildingTypes],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...BuildingTypesQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...BuildingTypesQueryKeys.all().queryKey, "common"],
  }),
};

export function useBuildingTypesList(): ApiQueryResult<BuildingTypeDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.BuildingType.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...BuildingTypesQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useBuildingTypesCommon(): UseQueryResult<
  BuildingTypeCommonDto[]
> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...BuildingTypesQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.BuildingType.commonGet({
        deleted: false,
      }),
  });
}

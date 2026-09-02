import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult } from "./types.ts";

// lib
import { ResourceDto, ResourceCommonDto } from "lib";

// api
import { TablesCamelCase } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const ResourcesQueryKeys = {
  all: () => ({
    queryKey: [TablesCamelCase.Resources],
  }),
  list: () => ({
    queryKey: [...ResourcesQueryKeys.all().queryKey, "list"],
  }),
  common: () => ({
    queryKey: [...ResourcesQueryKeys.all().queryKey, "common"],
  }),
};

export function useResourcesList(): ApiQueryResult<ResourceDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Resource.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...ResourcesQueryKeys.list(),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useResourcesCommon(): UseQueryResult<ResourceCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...ResourcesQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Resource.commonGet({
        deleted: false,
      }),
  });
}

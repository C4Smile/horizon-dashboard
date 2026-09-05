import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions, withTotal } from "./types.ts";

// lib
import { ResourceDto, ResourceCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const ResourcesQueryKeys = {
  all: () => ({
    queryKey: [Tables.Resources],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...ResourcesQueryKeys.all().queryKey, "list", options ?? {}],
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
      horizonApiClient.Resource.get(
        {
          sortingBy: sortingBy as keyof ResourceDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...ResourcesQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useResourcesCommon(): UseQueryResult<ResourceCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...ResourcesQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Resource.commonGet({
        deletedAt: null,
      }),
  });
}

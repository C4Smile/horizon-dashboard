import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions } from "./types.ts";

// lib
import { TechDto, TechCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const TechsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Techs],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...TechsQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...TechsQueryKeys.all().queryKey, "common"],
  }),
};

export function useTechsList(): ApiQueryResult<TechDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Tech.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...TechsQueryKeys.list({
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

export function useTechsCommon(): UseQueryResult<TechCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...TechsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Tech.commonGet({
        deletedAt: null,
      }),
  });
}

import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import {
  ApiQueryResult,
  TableQueryOptions,
  withTotal,
} from "hooks/queries/types";

// lib
import { TechTypeDto, TechTypeCommonDto } from "../lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const TechTypesQueryKeys = {
  all: () => ({
    queryKey: [Tables.TechTypes],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...TechTypesQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...TechTypesQueryKeys.all().queryKey, "common"],
  }),
};

export function useTechTypesList(): ApiQueryResult<TechTypeDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.TechType.get(
        {
          sortingBy: sortingBy as keyof TechTypeDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...TechTypesQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useTechTypesCommon(): UseQueryResult<TechTypeCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...TechTypesQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.TechType.commonGet({
        deletedAt: null,
      }),
  });
}

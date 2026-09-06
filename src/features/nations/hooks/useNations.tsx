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
import { NationDto, NationCommonDto } from "../lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const NationsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Nations],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...NationsQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...NationsQueryKeys.all().queryKey, "common"],
  }),
};

export function useNationsList(): ApiQueryResult<NationDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Nation.get(
        {
          sortingBy: sortingBy as keyof NationDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...NationsQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useNationsCommon(): UseQueryResult<NationCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...NationsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Nation.commonGet({
        deletedAt: null,
      }),
  });
}

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
import { CannonDto, CannonCommonDto } from "../lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const CannonsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Cannons],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...CannonsQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...CannonsQueryKeys.all().queryKey, "common"],
  }),
};

export function useCannonsList(): ApiQueryResult<CannonDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Cannon.get(
        {
          sortingBy: sortingBy as keyof CannonDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...CannonsQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useCannonsCommon(): UseQueryResult<CannonCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...CannonsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Cannon.commonGet({
        deletedAt: null,
      }),
  });
}

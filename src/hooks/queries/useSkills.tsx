import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions, withTotal } from "./types.ts";

// lib
import { SkillDto, SkillCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const SkillsQueryKeys = {
  all: () => ({
    queryKey: [Tables.Skills],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...SkillsQueryKeys.all().queryKey, "list", options ?? {}],
  }),
  common: () => ({
    queryKey: [...SkillsQueryKeys.all().queryKey, "common"],
  }),
};

export function useSkillsList(): ApiQueryResult<SkillDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.Skill.get(
        {
          sortingBy: sortingBy as keyof SkillDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...SkillsQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useSkillsCommon(): UseQueryResult<SkillCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...SkillsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Skill.commonGet({
        deletedAt: null,
      }),
  });
}

import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult } from "./types.ts";

// lib
import { SkillDto, SkillCommonDto } from "lib";

// api
import { TablesCamelCase } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const SkillsQueryKeys = {
  all: () => ({
    queryKey: [TablesCamelCase.Skills],
  }),
  list: () => ({
    queryKey: [...SkillsQueryKeys.all().queryKey, "list"],
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
      horizonApiClient.Skill.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...SkillsQueryKeys.list(),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useSkillsCommon(): UseQueryResult<SkillCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...SkillsQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.Skill.commonGet({
        deleted: false,
      }),
  });
}

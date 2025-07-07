import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  BuildingTypeDto,
  BuildingTypeCommonDto,
  BuildingTypeFilterDto,
  QueryResult,
} from "lib";

// api
import { TablesCamelCase } from "api";

export const BuildingTypesQueryKeys = {
  all: () => ({
    queryKey: [TablesCamelCase.BuildingTypes],
  }),
  list: () => ({
    queryKey: [...BuildingTypesQueryKeys.all().queryKey, "list"],
  }),
  common: () => ({
    queryKey: [...BuildingTypesQueryKeys.all().queryKey, "common"],
  }),
};

export function useBuildingTypesList(
  props: UseFetchPropsType<BuildingTypeFilterDto>
): UseQueryResult<QueryResult<BuildingTypeDto>> {
  const { filters = { deleted: false } } = props;

  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...BuildingTypesQueryKeys.list(),
    queryFn: async () => horizonApiClient.BuildingType.get(filters),
  });
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

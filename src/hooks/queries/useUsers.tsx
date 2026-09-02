import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult } from "./types.ts";

// lib
import { UserDto, UserCommonDto } from "lib";

// api
import { TablesCamelCase } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const UsersQueryKeys = {
  all: () => ({
    queryKey: [TablesCamelCase.Users],
  }),
  list: () => ({
    queryKey: [...UsersQueryKeys.all().queryKey, "list"],
  }),
  common: () => ({
    queryKey: [...UsersQueryKeys.all().queryKey, "common"],
  }),
};

export function useUsersList(): ApiQueryResult<UserDto> {
  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const query = useQuery({
    queryFn: async () =>
      horizonApiClient.User.get({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
    ...UsersQueryKeys.list(),
  });

  return {
    ...query,
    setTotal,
  };
}

export function useUsersCommon(): UseQueryResult<UserCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...UsersQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.User.commonGet({
        deleted: false,
      }),
  });
}

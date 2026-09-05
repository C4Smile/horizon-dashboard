import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useHorizonApiClient } from "providers";

// types
import { ApiQueryResult, TableQueryOptions, withTotal } from "./types.ts";

// lib
import { UserDto, UserCommonDto } from "lib";

// api
import { Tables } from "api";

// hooks
import { useTableOptions } from "@sito/dashboard-app";

export const UsersQueryKeys = {
  all: () => ({
    queryKey: [Tables.Users],
  }),
  list: (options?: TableQueryOptions) => ({
    queryKey: [...UsersQueryKeys.all().queryKey, "list", options ?? {}],
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
      horizonApiClient.User.get(
        {
          sortingBy: sortingBy as keyof UserDto,
          sortingOrder,
          currentPage,
          pageSize,
        },
        filters,
      ),
    ...UsersQueryKeys.list({
      sortingBy,
      sortingOrder,
      currentPage,
      pageSize,
      ...filters,
    }),
  });

  return withTotal(query, setTotal);
}

export function useUsersCommon(): UseQueryResult<UserCommonDto[]> {
  const horizonApiClient = useHorizonApiClient();

  return useQuery({
    ...UsersQueryKeys.common(),
    queryFn: async () =>
      horizonApiClient.User.commonGet({
        deletedAt: null,
      }),
  });
}

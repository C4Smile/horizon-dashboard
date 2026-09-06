import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useTableOptions } from "@sito/dashboard-app";

// types
import { UseApiQueryPropsType, ApiQueryResult } from "./types";

// lib
import { BaseEntityDto } from "lib";

/**
 *
 * @param {object} props hook props
 * @returns useApiQuery
 */
export const useHorizonQuery = <TResponseDto extends BaseEntityDto>(
  props: UseApiQueryPropsType<TResponseDto>,
): ApiQueryResult<TResponseDto> => {
  const { getFunction, queryKey } = props;

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  // UseQueryResult is a discriminated union. Spreading it into a new object
  // collapses the union and the result stops matching ApiQueryResult, so the
  // extra field is attached to the result rather than copied out of it.
  const query = useQuery({
    queryKey: [
      queryKey,
      { sortingBy, sortingOrder, currentPage, pageSize },
      { ...filters },
    ],
    queryFn: () =>
      getFunction({
        sortingBy,
        sortingOrder,
        currentPage,
        pageSize,
        ...filters,
      }),
  });

  return Object.assign(query, { setTotal });
};

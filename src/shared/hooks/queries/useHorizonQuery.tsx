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

  return {
    ...useQuery({
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
    }),
    setTotal,
  };
};

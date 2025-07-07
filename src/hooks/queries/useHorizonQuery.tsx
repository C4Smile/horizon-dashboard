import { useQuery } from "@tanstack/react-query";

// @sito/dashboard
import { useTableOptions } from "@sito/dashboard";

// types
import { UseApiQueryPropsType } from "./types";
import { BaseEntityDto, BaseFilterDto } from "lib";

/**
 *
 * @param {object} props hook props
 * @returns useApiQuery
 */
export const useApiQuery = <
  TFilterDto extends BaseFilterDto,
  TResponseDto extends BaseEntityDto,
>(
  props: UseApiQueryPropsType<TFilterDto, TResponseDto>
) => {
  const { getFunction, queryKey } = props;

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize, filters } =
    useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [
      queryKey,
      { sortingBy, sortingOrder, currentPage, pageSize },
      { ...filters },
    ],
    queryFn: () =>
      getFunction({ sortingBy, sortingOrder, currentPage, pageSize }, filters),
  });

  return {
    data,
    isLoading,
    setTotal,
  };
};

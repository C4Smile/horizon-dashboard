import { QueryKey, UseQueryResult } from "@tanstack/react-query";

// lib
import { BaseEntityDto, BaseFilterDto, QueryResult } from "lib";

export type UseFetchPropsType<TFilterDto> = {
  filters?: TFilterDto;
};

/**
 * The table options a list query is keyed on, so react-query refetches when the
 * user sorts, pages or filters instead of serving the first page forever
 */
export type TableQueryOptions = Record<string, unknown>;

export type UseFetchByIdPropsType = {
  id: number;
};

export type UseApiQueryPropsType<TResponseDto extends BaseEntityDto> = {
  getFunction: (query: BaseFilterDto) => Promise<QueryResult<TResponseDto[]>>;
  queryKey: QueryKey;
};

export type ApiQueryResult<
  TResponseDto extends BaseEntityDto,
  TError = Error,
> = UseQueryResult<QueryResult<TResponseDto>, TError> & {
  setTotal: (total: number) => void;
};

/**
 * react-query's result is a discriminated union, and spreading it collapses
 * the discriminant, so the extra field is attached instead of spread.
 * @param query - the query result
 * @param setTotal - the table's total setter
 * @returns the query result carrying setTotal
 */
export function withTotal<TResponseDto extends BaseEntityDto, TError = Error>(
  query: UseQueryResult<QueryResult<TResponseDto>, TError>,
  setTotal: (total: number) => void,
): ApiQueryResult<TResponseDto, TError> {
  return Object.assign({}, query, { setTotal });
}

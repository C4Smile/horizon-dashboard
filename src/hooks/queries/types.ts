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

export interface ApiQueryResult<
  TResponseDto extends BaseEntityDto,
> extends Omit<UseQueryResult<QueryResult<TResponseDto>>, "setTotal"> {
  setTotal: (total: number) => void;
}

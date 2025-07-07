import { TableFilters } from "@sito/dashboard";
import { QueryKey } from "@tanstack/react-query";

// lib
import { BaseEntityDto, BaseFilterDto, QueryResult } from "lib";

export type UseFetchPropsType<TFilterDto> = {
  filters?: TFilterDto;
};

export type UseFetchByIdPropsType = {
  id: number;
};

export type UseApiQueryPropsType<TResponseDto extends BaseEntityDto> = {
  getFunction: (
    query: BaseFilterDto,
    filters: TableFilters
  ) => Promise<QueryResult<TResponseDto[]>>;
  queryKey: QueryKey;
};

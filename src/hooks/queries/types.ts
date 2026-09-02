import { QueryKey, UseQueryResult } from "@tanstack/react-query";

// lib
import { BaseEntityDto, BaseFilterDto, QueryResult } from "lib";

export type UseFetchPropsType<TFilterDto> = {
  filters?: TFilterDto;
};

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

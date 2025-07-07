import { QueryKey } from "@tanstack/react-query";

// lib
import { BaseEntityDto, BaseFilterDto, QueryResult } from "lib";

export type UseFetchPropsType<TFilterDto> = {
  filters?: TFilterDto;
};

export type UseFetchByIdPropsType = {
  id: number;
};

export type UseApiQueryPropsType<
  TFilterDto extends BaseFilterDto,
  TResponseDto extends BaseEntityDto,
> = {
  getFunction: (
    query: BaseFilterDto,
    filters: TFilterDto
  ) => Promise<QueryResult<TResponseDto[]>>;
  queryKey: QueryKey;
};

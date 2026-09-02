import { SortOrder } from "@sito/dashboard-app";

export interface BaseFilterDto {
  deleted?: boolean;
  sortingBy?: string;
  sortingOrder?: SortOrder;
  currentPage?: number;
  pageSize?: number;
}

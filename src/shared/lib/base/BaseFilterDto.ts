import { SortOrder } from "@sito/dashboard-app";

export interface BaseFilterDto {
  deletedAt?: string | null;
  sortingBy?: string;
  sortingOrder?: SortOrder;
  currentPage?: number;
  pageSize?: number;
}

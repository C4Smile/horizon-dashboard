import { SortOrder } from "@sito/dashboard-app";

export interface BaseFilterDto {
  deletedAt?: Date | null;
  sortingBy?: string;
  sortingOrder?: SortOrder;
  currentPage?: number;
  pageSize?: number;
}

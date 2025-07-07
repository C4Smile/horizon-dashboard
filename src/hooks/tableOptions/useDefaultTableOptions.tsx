import { useEffect } from "react";
import { useTableOptions, SortOrder } from "@sito/dashboard";

// types
import { UseDefaultTableOptions } from "./types";

/**
 *
 * @param props component props
 * @returns {{setTotal: *, sortingOrder: *, pageSize: *, currentPage: *, sortingBy: *}} table options
 */
export const useDefaultTableOptions = (props: UseDefaultTableOptions) => {
  const { entity } = props;

  const {
    setTotal,
    sortingBy,
    setSortingBy,
    sortingOrder,
    setSortingOrder,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  } = useTableOptions();

  useEffect(() => {
    setSortingBy("id");
    setSortingOrder(SortOrder.DESC);
    setCurrentPage(0);
    setPageSize(20);
  }, [entity, setCurrentPage, setPageSize, setSortingBy, setSortingOrder]);

  return {
    setTotal,
    sortingBy,
    sortingOrder,
    pageSize,
    currentPage,
  };
};

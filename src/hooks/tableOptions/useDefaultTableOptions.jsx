import { useTableOptions } from "@sito/dashboard";

import { SortOrder } from "../../models/query/GenericFilter.js";
import { useEffect } from "react";

/**
 *
 * @param props component props
 * @returns {{setTotal: *, sortingOrder: *, pageSize: *, currentPage: *, sortingBy: *}} table options
 */
export const useDefaultTableOptions = (props) => {
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

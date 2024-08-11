import { createContext, useCallback, useContext, useState } from "react";

// utils
import { SortOrder } from "../../../models/query/GenericFilter";

const pageSizes = [20, 50, 100];

class TableOptions {
  onSort = (attribute) => attribute;
  total = 0;
  setTotal = (value) => value;
  sortingBy = "";
  sortingOrder = "";
  pageSize = 0;
  pageSizes = [];
  setPageSize = (value) => value;
  currentPage = 0;
  setCurrentPage = (value) => value;
}

const TableOptionsContext = createContext(TableOptions);

/**
 * Table options
 * @param {object} props - options
 * @returns {object} - options
 */
const TableOptionsProvider = (props) => {
  const { children } = props;

  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const [sortingBy, setSortingBy] = useState("dateOfCreation");
  const [sortingOrder, setSortingOrder] = useState(SortOrder.ASC);

  const onSort = useCallback(
    (attribute) => {
      let localSortingOrder = sortingOrder;
      if (sortingBy === attribute)
        switch (sortingOrder) {
          case SortOrder.ASC:
            localSortingOrder = SortOrder.DESC;
            break;
          default:
            localSortingOrder = SortOrder.ASC;
            break;
        }
      setSortingBy(attribute);
      setSortingOrder(localSortingOrder);
    },
    [sortingBy, sortingOrder],
  );

  const value = {
    onSort,
    total,
    setTotal,
    sortingBy,
    sortingOrder,
    pageSize,
    pageSizes,
    setPageSize,
    currentPage,
    setCurrentPage,
  };
  return <TableOptionsContext.Provider value={value}>{children}</TableOptionsContext.Provider>;
};

/**
 *
 * @returns {TableOptions} - options
 */
const useTableOptions = () => {
  const context = useContext(TableOptionsContext);
  if (context === undefined) throw new Error("tableOptionsContext must be used within a Provider");
  return context;
};

export { TableOptionsProvider, useTableOptions };

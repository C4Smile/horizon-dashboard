import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// hooks
import { useDefaultTableOptions } from "../tableOptions/useDefaultTableOptions.jsx";

/**
 *
 * @param props hook properties
 * @returns {{isLoading: boolean, data: unknown}} return data
 */
export const useHorizonQuery = (props) => {
  const { entity, queryFn } = props;

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useDefaultTableOptions({
    entity,
  });

  const { data, isLoading } = useQuery({
    enabled: !!entity?.length,
    queryKey: [entity, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => queryFn({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  return {
    data,
    isLoading,
  };
};

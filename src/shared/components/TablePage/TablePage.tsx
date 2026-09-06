import { useEffect } from "react";

// providers
import { useNavbar } from "providers";

// types
import { TablePagePropsType } from "./types";

/**
 *
 * @param {object} props component props
 * @returns TablePage
 */
export const TablePage = (props: TablePagePropsType) => {
  const { children, title } = props;

  const { setTitle } = useNavbar();

  useEffect(() => {
    setTitle(title ?? "");
  }, [setTitle, title]);

  return <div className="h-full">{children}</div>;
};

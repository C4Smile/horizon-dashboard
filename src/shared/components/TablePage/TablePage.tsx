// types
import { TablePagePropsType } from "./types";

/**
 *
 * @param {object} props component props
 * @returns TablePage
 */
export const TablePage = (props: TablePagePropsType) => {
  const { children, title } = props;

  // the title used to go into the navbar, next to the menu button, which left
  // the app without a name of its own. It sits over its table now and the
  // navbar keeps the app name.
  return (
    <div className="h-full">
      {!!title?.length && <h1 className="page-title">{title}</h1>}
      {children}
    </div>
  );
};

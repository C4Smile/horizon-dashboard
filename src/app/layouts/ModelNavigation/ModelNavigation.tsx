import { Outlet } from "react-router-dom";

// hooks
import { useEntityNavbarActions } from "hooks";

// types
import { ModelNavigationPropsType } from "./types";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
export function ModelNavigation(props: ModelNavigationPropsType) {
  const { pageKey, noInsert } = props;

  // the list and insert links used to sit in a bar of their own under the
  // header. They are navbar actions now, and the layout is the one place that
  // covers both the list route and the two form routes below it.
  useEntityNavbarActions(pageKey, { noInsert });

  return (
    <div className="h-full">
      <div className="p-5 h-full">
        <Outlet />
      </div>
    </div>
  );
}

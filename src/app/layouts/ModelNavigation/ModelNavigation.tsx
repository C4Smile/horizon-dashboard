import { Outlet } from "react-router-dom";

// sitemap
import { findPath } from "pages";

// types
import { ModelNavigationPropsType } from "./types";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
export function ModelNavigation(props: ModelNavigationPropsType) {
  const { pageKey } = props;

  // the forms below draw the chevron back to this list next to their own
  // title, and only this layout knows which list that is
  return (
    <div className="h-full">
      <div className="p-5 h-full">
        <Outlet context={{ listPath: findPath(pageKey) }} />
      </div>
    </div>
  );
}

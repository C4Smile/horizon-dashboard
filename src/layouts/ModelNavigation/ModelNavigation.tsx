import { Outlet } from "react-router-dom";

// components
import Links from "./Links";

// types
import { ModelNavigationPropsType } from "./types";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
function ModelNavigation(props: ModelNavigationPropsType) {
  return (
    <div className="h-full">
      <Links {...props} />
      <div className="p-5 h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default ModelNavigation;

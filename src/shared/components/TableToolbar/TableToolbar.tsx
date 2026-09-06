import { Link } from "react-router-dom";

// sitemap
import { findNewPath } from "pages";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { TableToolbarPropsType } from "./types";

/**
 *
 * @param props component props
 * @returns TableToolbar component
 */
export function TableToolbar(props: TableToolbarPropsType) {
  const { pageKey } = props;

  const newPath = findNewPath(pageKey);

  return (
    <ul>
      <Link
        to={newPath}
        className="filter-dropdown-button normal filter-dropdown-trigger"
      >
        <FontAwesomeIcon icon={faAdd} />
      </Link>
    </ul>
  );
}

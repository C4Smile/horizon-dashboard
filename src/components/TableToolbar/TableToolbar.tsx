import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// sitemap
import { findPath } from "../../pages/sitemap";

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

  const { t } = useTranslation();

  const pathName = findPath(pageKey);

  return (
    <ul>
      <Link
        to={`${pathName}/${t("_accessibility:labels.new")}`}
        className="filter-dropdown-button normal filter-dropdown-trigger"
      >
        <FontAwesomeIcon icon={faAdd} />
      </Link>
    </ul>
  );
}

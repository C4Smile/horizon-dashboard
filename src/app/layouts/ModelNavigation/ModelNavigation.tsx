import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

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

  const { pathname } = useLocation();
  const { t } = useTranslation();

  const listPath = findPath(pageKey);

  // this layout mounts the list and the two forms under it, so any route but
  // the list is one of the forms
  const inForm = pathname !== listPath;

  return (
    <div className="h-full">
      <div className="p-5 h-full">
        {inForm && (
          <Link
            to={listPath}
            className="icon-button button text-primary hover:text-hover-primary"
            aria-label={t("_accessibility:buttons.back")}
            title={t("_accessibility:buttons.back")}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
        )}
        <Outlet />
      </div>
    </div>
  );
}

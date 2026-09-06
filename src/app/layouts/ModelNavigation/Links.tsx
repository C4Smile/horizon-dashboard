import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// sitemap
import { findPath } from "pages";

// types
import { LinksPropsTypes } from "./types";

/**
 *
 * @param {object} props component props
 * @returns Links component
 */
export function Links(props: LinksPropsTypes) {
  const {
    pageKey,
    noInsert = false,
    navClassName = "",
    linksClassName = "",
  } = props;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pathName = findPath(pageKey);

  return (
    <nav className={`flex bg-surface w-full px-4 ${navClassName}`}>
      <Link
        className={`px-3 py-2 ${linksClassName} ${
          pathname === pathName
            ? "text-fg-muted disabled-link"
            : "text-primary hover:text-hover-primary"
        }`}
        to={pathName}
      >
        {t("_accessibility:buttons.list")}
      </Link>
      {!noInsert && (
        <Link
          className={`px-3 py-2 ${linksClassName} ${
            pathname === `${pathName}/${t("_accessibility:labels.new")}` ||
            pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)
              ? "text-fg-muted disabled-link"
              : "text-primary hover:text-hover-primary"
          }`}
          to={`${pathName}/${t("_accessibility:labels.new")}`}
        >
          {t("_accessibility:buttons.insert")}
        </Link>
      )}
    </nav>
  );
}

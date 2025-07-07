import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// sitemap
import { findPath } from "../../pages/sitemap";

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
    <nav className={`flex bg-slate-200 w-full px-4 ${navClassName}`}>
      <Link
        className={`px-3 py-2 ${linksClassName} ${
          pathname === `${pathName}`
            ? "text-light-primary/40 disabled-link"
            : "text-primary hover:text-dark-primary"
        }`}
        to={`${pathName}`}
      >
        {t("_accessibility:buttons.list")}
      </Link>
      {!noInsert && (
        <Link
          className={`px-3 py-2 ${linksClassName} ${
            pathname === `${pathName}/${t("_accessibility:labels.new")}` ||
            pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)
              ? "text-light-primary/40 disabled-link"
              : "text-primary hover:text-dark-primary"
          }`}
          to={`${pathName}/${t("_accessibility:labels.new")}`}
        >
          {t("_accessibility:buttons.insert")}
        </Link>
      )}
    </nav>
  );
}

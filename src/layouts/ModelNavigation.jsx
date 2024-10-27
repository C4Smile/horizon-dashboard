import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Outlet, Link } from "react-router-dom";

// pages
import { findPath } from "../pages/sitemap";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
function ModelNavigation(props) {
  const { pageKey, noInsert } = props;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pathName = findPath(pageKey);

  return (
    <div>
      <nav className="flex bg-slate-200 w-full px-4">
        <Link
          disabled={pathname === pathName}
          className={`px-3 py-2 ${
            pathname === pathName
              ? "text-light-primary/40 disabled-link"
              : "text-primary hover:text-dark-primary"
          }`}
          to={pathName}
        >
          {t("_accessibility:buttons.list")}
        </Link>
        {!noInsert && (
          <Link
            disabled={pathname === `${pathName}/new` || pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)}
            className={`px-3 py-2 ${
              pathname === `${pathName}/new` || pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)
                ? "text-light-primary/40 disabled-link"
                : "text-primary hover:text-dark-primary"
            }`}
            to={`${pathName}/new`}
          >
            {t("_accessibility:buttons.insert")}
          </Link>
        )}
      </nav>
      <div className="p-5">
        <Outlet />
      </div>
    </div>
  );
}

export default ModelNavigation;

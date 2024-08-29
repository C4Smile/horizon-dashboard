import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Outlet, Link } from "react-router-dom";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
function ModelNavigation(props) {
  const { model, parent, noInsert } = props;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div>
      <nav className="flex bg-slate-200 w-full px-4">
        <Link
          disabled={pathname === `/${parent}/${model}`}
          className={`px-3 py-2 ${
            pathname === `/${parent}/${model}`
              ? "text-light-primary/40 disabled-link"
              : "text-primary hover:text-dark-primary"
          }`}
          to={`/${parent}/${model}`}
        >
          {t("_accessibility:buttons.list")}
        </Link>
        {!noInsert && (
          <Link
            disabled={
              pathname === `/${parent}/${model}/nuevo` || pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)
            }
            className={`px-3 py-2 ${
              pathname === `/${parent}/${model}/nuevo` || pathname.match(/^\/[^/]+\/[^/]+\/\d+$/)
                ? "text-light-primary/40 disabled-link"
                : "text-primary hover:text-dark-primary"
            }`}
            to={`/${parent}/${model}/nuevo`}
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

import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Outlet, Link } from "react-router-dom";

/**
 * ModelNavigation layout
 * @param {object} props - Props
 * @returns ModelNavigation layout component
 */
function ModelNavigation(props) {
  const { model, parent } = props;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div>
      <nav className="flex p-4 bg-slate-200 dark:bg-slate-800 w-full">
        <Link
          disabled={pathname === `/${parent}/${model}`}
          className={`px-3 py-2 ${
            pathname === `/${parent}/${model}`
              ? "text-slate-400 disabled-link"
              : "text-slate-600 hover:text-slate-800 dark:hover:text-white"
          }`}
          to={`/${parent}/${model}`}
        >
          {t("_accessibility:buttons.list")}
        </Link>
        <Link
          disabled={pathname === `/${parent}/${model}/new`}
          className={`px-3 py-2 ${
            pathname === `/${parent}/${model}/new`
              ? "text-slate-400 disabled-link"
              : "text-slate-600 hover:text-slate-800 dark:hover:text-white"
          }`}
          to={`/${parent}/${model}/new`}
        >
          {t("_accessibility:buttons.insert")}
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default ModelNavigation;

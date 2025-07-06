import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import { ChevronUp } from "@sito/dashboard";

// types
import { SidebarItemPropsType } from "./types";

/**
 * Sidebar Item component
 * @param props - sidebar item props (page, path, handleClick, open, icon, child)
 * @returns SidebarItem component
 */
export function SidebarItem(props: SidebarItemPropsType) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const { page, path, handleClick, open, icon, children } = props;

  return (
    <>
      <button
        className={`w-full block truncate transition duration-150 ${
          pathname === path || pathname.includes(page)
            ? ""
            : "hover:text-slate-800"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <span className="text-sm font-medium ml-3 duration-200">
              {t(`_pages:${page}.title`)}
            </span>
          </div>
          {/* Icon */}
          <div className="flex shrink-0 ml-2">
            <ChevronUp className={`ml-1 ${open && "rotate-180"}`} />
          </div>
        </div>
      </button>
      <div className="lg:block 2xl:block">
        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
          {children.map((item) => (
            <li key={item.label} className="mb-1 last:mb-0">
              <NavLink
                end
                to={`${path !== "/" ? path : ""}${item.path}`}
                className={({ isActive }) =>
                  "block transition duration-150 truncate " +
                  (isActive ? "text-primary" : "hover:text-slate-800 ")
                }
              >
                <span className="text-sm font-medium duration-200">
                  {t(`_pages:${page}.links.${item.label}`)}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

// components
import SidebarLinkGroup from "./SidebarLinkGroup";
import SidebarItem from "./SidebarItem";

// sitemap
import { sitemap } from "../sitemap";
import { useTranslation } from "react-i18next";

// images
import logo from "../../assets/images/logo.webp";

/**
 * Sidebar
 * @param {object} props - React props
 * @returns {object} React component
 */
function Sidebar(props) {
  const { t } = useTranslation();
  const location = useLocation();

  const { sidebarOpen, setSidebarOpen } = props;
  const { pathname } = location;

  const icons = {
    dashboard: (
      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
          className={`fill-current ${
            pathname === "/" || pathname.includes("dashboard") ? "text-primary" : "text-slate-400"
          }`}
          d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
        />
        <path
          className={`fill-current ${
            pathname === "/" || pathname.includes("dashboard") ? "text-light-primary" : "text-white"
          }`}
          d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
        />
        <path
          className={`fill-current ${
            pathname === "/" || pathname.includes("dashboard") ? "text-white" : "text-slate-400"
          }`}
          d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
        />
      </svg>
    ),
    management: (
      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
          className={`fill-current ${pathname.includes("management") ? "text-secondary" : "text-slate-400"}`}
          d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
        />
        <path
          className={`fill-current ${pathname.includes("management") ? "text-light-primary" : "text-white"}`}
          d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
        />
        <path
          className={`fill-current ${pathname.includes("management") ? "text-primary" : "text-slate-600"}`}
          d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
        />
      </svg>
    ),
    personal: (
      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
          className={`fill-current ${pathname.includes("personal") ? "text-primary" : "text-slate-600"}`}
          d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
        />
        <path
          className={`fill-current ${pathname.includes("personal") ? "text-light-primary" : "text-slate-400"}`}
          d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
        />
      </svg>
    ),
    settings: (
      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <circle
          className={`fill-current ${pathname.includes("settings") ? "text-light-primary" : "text-slate-400"}`}
          cx="18.5"
          cy="5.5"
          r="4.5"
        />
        <circle
          className={`fill-current ${pathname.includes("settings") ? "text-primary" : "text-slate-600"}`}
          cx="5.5"
          cy="5.5"
          r="4.5"
        />
        <circle
          className={`fill-current ${pathname.includes("settings") ? "text-primary" : "text-slate-600"}`}
          cx="18.5"
          cy="18.5"
          r="4.5"
        />
        <circle
          className={`fill-current ${pathname.includes("settings") ? "text-light-primary" : "text-slate-400"}`}
          cx="5.5"
          cy="18.5"
          r="4.5"
        />
      </svg>
    ),
  };

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-200 dark:bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-200 dark:bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">{t("_accessibility:buttons.closeSidebar")}</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <img src={logo} alt="logo del museo" className="w-8" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
            </h3>
            <ul className="mt-3">
              {sitemap.map((item) => (
                <SidebarLinkGroup
                  key={item.page}
                  hi={item.page}
                  activeCondition={pathname === item.path || pathname.includes(item.page)}
                >
                  {(handleClick, open) => (
                    <SidebarItem
                      page={item.page}
                      path={item.path}
                      handleClick={() => {
                        sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                      }}
                      open={open}
                      child={item.child}
                      icon={icons[item.page]}
                    />
                  )}
                </SidebarLinkGroup>
              ))}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

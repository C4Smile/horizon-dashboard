import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faBellConcierge,
  faChartLine,
  faGear,
  faRss,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// components
import Logo from "../../components/Logo/Logo";
import SidebarLinkGroup from "./SidebarLinkGroup";
import SidebarItem from "./SidebarItem";

// sitemap
import { sitemap } from "../sitemap";
import { useTranslation } from "react-i18next";

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
    dashboard: <FontAwesomeIcon icon={faChartLine} />,
    information: <FontAwesomeIcon icon={faRss} />,
    management: <FontAwesomeIcon icon={faTableList} />,
    personal: <FontAwesomeIcon icon={faUsers} />,
    hotel: <FontAwesomeIcon icon={faBellConcierge} />,
    settings: <FontAwesomeIcon icon={faGear} />,
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
        className={`fixed inset-0 bg-slate-200 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 ${sidebarExpanded ? "lg:!w-64" : ""} 2xl:!w-64 shrink-0 bg-slate-200 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="relative flex justify-between mb-5 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="absolute lg:hidden text-slate-500 hover:text-slate-400"
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
          <NavLink
            end
            to="/"
            className={`mt-5 ${sidebarExpanded || sidebarOpen ? "!block" : "max-[1520px]:hidden"} block mx-auto`}
          >
            <Logo className="w-20 h-20" text={false} extra={false} />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
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
              <span className="sr-only">{t("_accessibility:.buttons.expandSidebar")}</span>
              <FontAwesomeIcon icon={!sidebarExpanded ? faArrowRightLong : faArrowLeftLong} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

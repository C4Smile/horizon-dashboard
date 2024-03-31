import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";

// components
import ToTop from "../components/ToTop/ToTop";
import Notification from "../partials/Notification";

// partials
import Sidebar from "../partials/sidebar/Sidebar";
import Header from "../partials/Header";

// utils
import { fromLocal, toLocal } from "../utils/local";
import config from "../config";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [main, setMain] = useState(null);

  useEffect(() => {
    setMain(mainRef?.current);
  }, [mainRef]);

  const location = useLocation();

  const saveRecentLocation = useCallback((content, link) => {
    const recentPages = fromLocal(config.recentPages, "object") ?? [];
    if (recentPages.length >= Number(config.recentPagesLimit))
      recentPages.splice(Number(config.recentPagesLimit) - 1);
    const newRecentPages = [{ link, text: content }, ...recentPages];
    toLocal(config.recentPages, newRecentPages);
  }, []);

  useEffect(() => {
    const { pathname } = location;
    saveRecentLocation(pathname, pathname);
  }, [location, saveRecentLocation]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div ref={mainRef} className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Outlet />
        </main>
      </div>
      <ToTop dealer={main} />
    </div>
  );
}

export default Dashboard;

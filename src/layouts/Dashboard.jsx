import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

import config from "../config";

// providers
import { useAccount } from "../providers/AccountProvider";
import { useMuseumApiClient } from "../providers/MuseumApiProvider";

// components
import ToTop from "../components/ToTop/ToTop";
import Notification from "../partials/Notification";

// partials
import Sidebar from "../partials/sidebar/Sidebar";
import Header from "../partials/Header";

// utils
import { fromLocal, toLocal } from "../utils/local";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
function Dashboard() {
  const { logoutUser } = useAccount();

  const museumApiClient = useMuseumApiClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [main, setMain] = useState(null);

  useEffect(() => {
    setMain(mainRef?.current);
  }, [mainRef]);

  const location = useLocation();
  const navigate = useNavigate();

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

  const refreshToken = useCallback(async () => {
    try {
      const value = await museumApiClient.User.validates();
      if (value.status === 400) throw Error("400");
      if (value.status === 401) throw Error("401");
      if (value.status === 403) throw Error("403");
      const recovering = getCookie(config.recovering);
      if (recovering?.length) navigate("/auth/update-password");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      logoutUser();
      navigate("/sign-out");
    }
  }, [logoutUser, museumApiClient.User, navigate]);

  useEffect(() => {
    refreshToken();
  }, [navigate, refreshToken]);

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

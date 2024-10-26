import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

import config from "../config";

// @sito/dashboard
import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

// providers
import { useAccount } from "../providers/AccountProvider";
import { useHorizonApiClient } from "../providers/HorizonApiProvider";

// components
import ToTop from "../components/ToTop/ToTop";
import Notification from "../partials/Notification";

// partials
import Sidebar from "../partials/sidebar/Sidebar";
import Header from "../partials/Header";

// utils
import { fromLocal, toLocal } from "../utils/local";

// pages
import { findPath, pageId } from "../pages/sitemap";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
function Dashboard() {
  const { t } = useTranslation();

  const { account, logoutUser } = useAccount();

  const horizonApiClient = useHorizonApiClient();
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
      const value = await horizonApiClient.User.validates();
      if (value.status === 400) throw Error("400");
      if (value.status === 401) throw Error("401");
      if (value.status === 403) throw Error("403");
      const recovering = getCookie(config.recovering);
      if (recovering?.length) navigate(findPath(pageId.updatePassword));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      logoutUser();
      navigate(findPath(pageId.signOut));
    }
  }, [logoutUser, horizonApiClient.User, navigate]);

  useEffect(() => {
    refreshToken();
  }, [account.user, navigate, refreshToken]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div ref={mainRef} className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <TableOptionsProvider>
            <TranslationProvider t={t}>
              <Outlet />
            </TranslationProvider>
          </TableOptionsProvider>
        </main>
      </div>
      <ToTop dealer={main} />
    </div>
  );
}

export default Dashboard;

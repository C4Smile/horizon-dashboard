import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

import config from "../config";

// @sito/dashboard
import { TableOptionsProvider, TranslationProvider } from "@sito/dashboard";

// providers
import { useAccount, HeaderProvider, useHorizonApiClient } from "providers";

// components
import ToTop from "../components/ToTop/ToTop";
import Notification from "../partials/Notification/Notification";

// partials
import { Sidebar, Header } from "partials";

// utils
import { useTranslation } from "react-i18next";

// pages
import { findPath, PageId } from "../pages/sitemap";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
export function Dashboard() {
  const { t } = useTranslation();

  const { account, logoutUser } = useAccount();

  const horizonApiClient = useHorizonApiClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [main, setMain] = useState(null);

  useEffect(() => {
    setMain(mainRef?.current);
  }, [mainRef]);

  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const value = await horizonApiClient.Auth.validates();
      if (value.status === 400) throw Error("400");
      if (value.status === 401) throw Error("401");
      if (value.status === 403) throw Error("403");
      const recovering = getCookie(config.recovering);
      if (recovering?.length) navigate(findPath(PageId.updatePassword));
    } catch (err) {
      console.error(err);
      logoutUser();
      navigate(findPath(PageId.signOut));
    }
  }, [logoutUser, horizonApiClient.Auth, navigate]);

  useEffect(() => {
    refreshToken();
  }, [account.user, navigate, refreshToken]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        ref={mainRef}
        className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden h-full"
      >
        {/*  Site header */}
        <HeaderProvider>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main ref={mainRef} className="dashboard">
            <TableOptionsProvider>
              <TranslationProvider t={t}>
                <Outlet />
              </TranslationProvider>
            </TableOptionsProvider>
          </main>
        </HeaderProvider>
      </div>
      <ToTop dealer={main} />
    </div>
  );
}

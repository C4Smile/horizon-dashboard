import { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { getCookie } from "some-javascript-utils/browser";

// @sito/dashboard-app
import {
  AppShell,
  DashboardHeader,
  Error,
  TableOptionsProvider,
  ToTop,
} from "@sito/dashboard-app";

// providers
import { useAccount, useHorizonApiClient } from "providers";

// components
import { Logo } from "components";

// pages
import { getMenuMap, MenuKeys } from "../menuMap";
import { findPath, PageId } from "pages";

// config
import config from "../../config";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
export function Dashboard() {
  const { t } = useTranslation();

  const { account, logoutUser } = useAccount();

  const horizonApiClient = useHorizonApiClient();

  const navigate = useNavigate();

  const menuMap = useMemo(() => getMenuMap(t), [t]);

  useEffect(() => {
    /**
     * Kicks the user out when the stored token is no longer accepted, and
     * routes them to the password update screen when a recovery is pending
     */
    const validateSession = async () => {
      try {
        await horizonApiClient.Auth.getSession();
        const recovering = getCookie(config.recovering);
        if (recovering?.length) navigate(findPath(PageId.updatePassword));
      } catch (err) {
        console.error(err);
        await logoutUser();
        navigate(findPath(PageId.signOut));
      }
    };

    void validateSession();
  }, [account.token, horizonApiClient.Auth, logoutUser, navigate]);

  // no footer on purpose: the entity tabs float their add button at the bottom
  // left and a footer would sit on top of it
  return (
    <AppShell
      header={
        <DashboardHeader<MenuKeys>
          menuMap={menuMap}
          logo={<Logo className="w-10 h-10" />}
        />
      }
      extras={<ToTop />}
    >
      <TableOptionsProvider>
        <ErrorBoundary FallbackComponent={Error}>
          <Outlet />
        </ErrorBoundary>
      </TableOptionsProvider>
    </AppShell>
  );
}

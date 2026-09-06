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

// api
import { isHttpRequestError } from "api";

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
      // nothing to validate: there is no session to begin with, and the api
      // call would only fail its way to the same place
      if (!account.token) {
        navigate(findPath(PageId.signIn));
        return;
      }

      try {
        await horizonApiClient.Auth.getSession();
        const recovering = getCookie(config.recovering);
        if (recovering?.length) navigate(findPath(PageId.updatePassword));
      } catch (err) {
        console.error(err);
        // only an api that rejects the token ends the session. Any other
        // failure is the network or the server having a bad moment, and
        // signing the user out over one would throw away whatever they were
        // in the middle of
        if (
          isHttpRequestError(err) &&
          (err.status === 401 || err.status === 403)
        ) {
          await logoutUser();
          navigate(findPath(PageId.signOut));
        }
      }
    };

    void validateSession();
  }, [account.token, horizonApiClient.Auth, logoutUser, navigate]);

  // no footer on purpose
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

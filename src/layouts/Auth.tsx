import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { getCookie } from "some-javascript-utils/browser";

// @sito/dashboard-app
import { AuthShell, Error } from "@sito/dashboard-app";

// providers
import { useAccount } from "providers";

// pages
import { findPath, PageId } from "../pages/sitemap";

// config
import config from "../config";

/**
 * Auth layout
 * @returns Auth component
 */
export function Auth() {
  const navigate = useNavigate();

  const { account } = useAccount();

  useEffect(() => {
    const recovering = getCookie(config.recovering);
    if (recovering?.length) navigate(findPath(PageId.updatePassword));
    else if (account.token) navigate(findPath(PageId.dashboard));
  }, [account, navigate]);

  return (
    <AuthShell>
      <ErrorBoundary FallbackComponent={Error}>
        <Outlet />
      </ErrorBoundary>
    </AuthShell>
  );
}

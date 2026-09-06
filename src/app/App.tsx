import { Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

import "shared/styles/variables.css";

// @sito/dashboard-app
import { SplashScreen } from "@sito/dashboard-app";

// sitemap
import { sitemap } from "./sitemap";

// providers
import { useAccount } from "providers";

// config
import config from "../config";

// pages
import { ViewPageType } from "./";

// lib
import { Roles } from "lib";

// Generals
const NotFound = loadable(() => import("components/NotFound/NotFound"));

/**
 *
 * @param pages the sitemap branch to render
 * @param userRole the current user role
 * @param parentRoute the parent route to render
 * @returns
 */
const renderRoutes = (
  pages: ViewPageType[],
  userRole: Roles,
  parentRoute?: string,
) =>
  pages
    .filter((page) => (page.role ? page.role.indexOf(userRole) >= 0 : true))
    .map((page) => {
      if (page.children) {
        return (
          <Route
            key={page.key}
            element={page.component}
            path={`${parentRoute ?? ""}${page.path}`}
          >
            {renderRoutes(page.children, userRole, page.path)}
          </Route>
        );
      } else {
        return (
          <Route
            key={page.key}
            element={page.component}
            path={`${parentRoute ?? ""}${page.path}`}
          />
        );
      }
    });

/** How long to wait for a stored session before giving up on it. */
const SESSION_RESTORE_TIMEOUT = 8_000;

/**
 * Main App
 * @returns App Component
 */
function App() {
  const [loading, setLoading] = useState(true);
  const [restoreGaveUp, setRestoreGaveUp] = useState(false);

  const { account, logUserFromLocal } = useAccount();
  const userRole = account?.horizonUser?.roleId as Roles;

  /**
   * A token in storage means there is a session to resolve. logUserFromLocal
   * asks the api for it, and it only clears the token when the api rejects it,
   * so a slow or failed request leaves the token in place and the role
   * undefined. Rendering then would filter every role gated route out of the
   * sitemap and drop the user on the not found page, which is what used to
   * happen on a heavy reload.
   */
  const resolvingSession =
    !restoreGaveUp && !userRole && !!localStorage.getItem(config.user);

  const location = useLocation();

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.scrollBehavior = "auto";
      window.scroll({ top: 0 });
      html.style.scrollBehavior = "";
    }
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    /**
     * Restores the session from the stored token before the routes are
     * resolved, the sitemap is filtered by role
     */
    const restoreSession = async () => {
      try {
        await logUserFromLocal();
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, [logUserFromLocal]);

  useEffect(() => {
    // never wait forever: a request that neither answers nor fails would hold
    // the splash screen for good
    const timer = setTimeout(
      () => setRestoreGaveUp(true),
      SESSION_RESTORE_TIMEOUT,
    );
    return () => clearTimeout(timer);
  }, []);

  const routes = useMemo(() => renderRoutes(sitemap, userRole), [userRole]);

  if (loading || resolvingSession) return <SplashScreen />;

  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        {routes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

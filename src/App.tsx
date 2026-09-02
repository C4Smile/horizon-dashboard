import { Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

import "./css/variables.css";

// @sito/dashboard-app
import { SplashScreen } from "@sito/dashboard-app";

// sitemap
import { sitemap } from "./pages/sitemap";

// providers
import { useAccount } from "providers";

// pages
import { ViewPageType } from "./pages/";

// lib
import { Roles } from "lib";

// Generals
const NotFound = loadable(() => import("./pages/NotFound/NotFound"));

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

/**
 * Main App
 * @returns App Component
 */
function App() {
  const [loading, setLoading] = useState(true);

  const { account, logUserFromLocal } = useAccount();
  const userRole = account?.horizonUser?.roleId as Roles;

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

  const routes = useMemo(() => renderRoutes(sitemap, userRole), [userRole]);

  if (loading) return <SplashScreen />;

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

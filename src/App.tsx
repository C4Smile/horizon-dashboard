import { Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

import "./css/style.css";

// sitemap
import { sitemap } from "./pages/sitemap";

// providers
import { useAccount } from "./providers/Account/AccountProvider";

// components
import SplashScreen from "./partials/Loading/SplashScreen";

// pages
import { ViewPageType } from "./pages/";

// lib
import { Roles } from "lib";

// Generals
const NotFound = loadable(() => import("./pages/NotFound/NotFound"));

/**
 *
 * @param sitemap the app sitemap
 * @param userRole the current user role
 * @param parentRoute the parent route to render
 * @returns
 */
const renderRoutes = (
  sitemap: ViewPageType[],
  userRole: Roles,
  parentRoute?: string
) =>
  sitemap
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
  const [loaded, setLoaded] = useState(true);

  const { account, logUserFromLocal } = useAccount();
  const userRole = account?.horizonUser?.roleId;

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
    logUserFromLocal();
  }, [logUserFromLocal]);

  const routes = useMemo(() => {
    if (!userRole) setLoaded(true);
    const routes = renderRoutes(sitemap, userRole);
    if (!userRole)
      setTimeout(() => {
        setLoaded(false);
      }, 1000);
    return routes;
  }, [userRole]);

  return (
    <>
      <SplashScreen visible={loaded} />
      <Suspense>
        <Routes>
          {routes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

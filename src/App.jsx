import { Suspense, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

// tippy styles
import "tippy.js/dist/tippy.css"; // optional

import "./css/style.css";

import "./charts/ChartjsConfig";

// sitemap
import { sitemap } from "./pages/sitemap";

// providers
import { useAccount } from "./providers/AccountProvider";

// components
import SplashScreen from "./partials/loading/SplashScreen";

// layouts

// Import pages
// Auth
const SignOut = loadable(() => import("./pages/Auth/SignOut"));
// Generals
const NotFound = loadable(() => import("./pages/NotFound/NotFound"));

const renderRoutes = (sitemap, userRole, parentRoute) =>
  sitemap
    .filter((page) => (page.role ? page.role.indexOf(userRole) >= 0 : true))
    .map((page) => {
      if (page.children) {
        return (
          <Route key={page.key} element={page.component} path={`${parentRoute ?? ""}${page.path}`}>
            {renderRoutes(page.children, userRole, page.path)}
          </Route>
        );
      } else {
        return (
          <Route key={page.key} element={page.component} path={`${parentRoute ?? ""}${page.path}`} />
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
  const userRole = account?.museumUser?.roleId;

  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    logUserFromLocal();
  }, [logUserFromLocal]);

  const routes = useMemo(() => {
    setLoaded(true);
    const routes = renderRoutes(sitemap, userRole);
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
          <Route path="/sign-out" element={<SignOut />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

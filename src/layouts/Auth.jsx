import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

// providers
import { useAccount } from "../providers/AccountProvider";

// partial
import Notification from "../partials/Notification";

// pages
import { findPath, pageId } from "../pages/sitemap";

import config from "../config";

/**
 * Auth layout
 * @returns Auth component
 */
function Auth() {
  const navigate = useNavigate();

  const { account } = useAccount();

  useEffect(() => {
    const recovering = getCookie(config.recovering);
    if (recovering?.length) navigate(findPath(pageId.updatePassword));
    else {
      if (account.user) navigate(findPath(pageId.dashboard));
    }
  }, [account, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      <Outlet />
    </div>
  );
}

export default Auth;

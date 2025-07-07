import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

// providers
import { useAccount } from "../providers/Account/AccountProvider";

// partial
import Notification from "../partials/Notification";

// pages
import { findPath, PageId } from "../pages/sitemap";

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
    else {
      if (account.user) navigate(findPath(PageId.dashboard));
    }
  }, [account, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      <Outlet />
    </div>
  );
}

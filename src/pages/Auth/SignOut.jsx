import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAccount } from "../../providers/AccountProvider";

// page
import { findPath, pageId } from "../sitemap";

/**
 * SignOut page
 * @returns SignOut page component
 */
function SignOut() {
  const { logoutUser } = useAccount();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    logoutUser();
    setTimeout(() => {
      navigate(findPath(pageId.signIn));
    }, 1000);
  }, [logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <div></div>;
}

export default SignOut;

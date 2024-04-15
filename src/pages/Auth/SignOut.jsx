import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAccount } from "../../providers/AccountProvider";

/**
 * SignOut page
 * @returns SignOut page component
 */
function SignOut() {
  const { logoutUser } = useAccount();

  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, [logoutUser, navigate]);

  return <div></div>;
}

export default SignOut;

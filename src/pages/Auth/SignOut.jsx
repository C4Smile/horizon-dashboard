import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAccount } from "../../providers/AccountProvider";

/**
 *
 * @returns
 */
function SignOut() {
  const { logoutUser } = useAccount();

  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, []);

  return <div></div>;
}

export default SignOut;

import { useEffect, useCallback } from "react";
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

  const logic = useCallback(async () => {
    logoutUser();
    setTimeout(() => {
      navigate("/autentificacion");
    }, 1000);
  }, [logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <div></div>;
}

export default SignOut;

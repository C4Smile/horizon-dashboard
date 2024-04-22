import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAccount } from "../../providers/AccountProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

/**
 * SignOut page
 * @returns SignOut page component
 */
function SignOut() {
  const museumApiClient = useMuseumApiClient();
  const { logoutUser } = useAccount();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    await museumApiClient.User.logout();
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, [museumApiClient.User, logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <div></div>;
}

export default SignOut;

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "../providers/AccountProvider";

/**
 * Auth layout
 * @returns Auth component
 */
function Auth() {
  const navigate = useNavigate();

  const { account } = useAccount();

  useEffect(() => {
    if (account.id) navigate("/");
  }, [account, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Outlet />
    </div>
  );
}

export default Auth;

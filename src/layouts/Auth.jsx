import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Auth layout
 * @returns Auth component
 */
function Auth() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Outlet />
    </div>
  );
}

export default Auth;

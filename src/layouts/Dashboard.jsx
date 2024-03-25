import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";

// components
import ToTop from "../components/ToTop/ToTop";
import Notification from "../partials/Notification";

// partials
import Sidebar from "../partials/sidebar/Sidebar";
import Header from "../partials/Header";

/**
 * Dashboard layout
 * @returns Dashboard layout component
 */
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [main, setMain] = useState(null);

  useEffect(() => {
    setMain(mainRef?.current);
  }, [mainRef]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Notification />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div ref={mainRef} className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Outlet />
        </main>
      </div>
      <ToTop dealer={main} />
    </div>
  );
}

export default Dashboard;

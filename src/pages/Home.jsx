import React from "react";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";

/**
 * Home
 * @returns Home page component
 */
function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Welcome banner */}
      <WelcomeBanner />
    </div>
  );
}

export default Home;

import React from "react";
import { useTranslation } from "react-i18next";

// providers
import { useAccount } from "../../providers/AccountProvider";

/**
 * WelcomeBanner
 * @returns {object} React component
 */
function WelcomeBanner() {
  const { t } = useTranslation();

  const { account } = useAccount();

  return (
    <div className="relative rounded-sm overflow-hidden mb-8">
      <img
        src={`https://ik.imagekit.io/tx6beroitnm/tr:w-1000,h-100/hotel/images/bg_LungOC9U1.jpeg`}
        alt="Hotel Imperial background"
        className="w-full h-full absolute top-0 left-0 object-cover object-top opacity-20"
      />
      {/* Content */}
      <div className="relative bg-white/20 p-4 sm:p-6 w-full h-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {t("_pages:home.welcome")}, {account?.horizonUser?.name} 👋
        </h1>
      </div>
    </div>
  );
}

export default WelcomeBanner;

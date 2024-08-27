import React from "react";
import PersonalInfo from "./sections/PersonalInfo";
import Security from "./sections/Security";
import { useTranslation } from "react-i18next";

/**
 * Account settings page
 * @returns Account component
 */
function Account() {
  const { t } = useTranslation();

  return (
    <div className="p-5 relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:settings.title")}</h1>
      <PersonalInfo />
      <Security />
    </div>
  );
}

export default Account;

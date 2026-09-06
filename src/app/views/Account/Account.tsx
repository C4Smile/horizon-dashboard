import { useTranslation } from "react-i18next";

import PersonalInfo from "./sections/PersonalInfo";

/**
 * Account settings page
 * @returns Account component
 */
function Account() {
  const { t } = useTranslation();

  return (
    <div className="p-5 relative">
      <h1 className="page-title">{t("_pages:settings.links.account")}</h1>
      <PersonalInfo />
    </div>
  );
}

export default Account;

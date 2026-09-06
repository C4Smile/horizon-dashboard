import { useTranslation } from "react-i18next";

import Security from "./sections/Security";

/**
 * Security settings page. It used to sit under the account form; the drawer
 * lists the two apart, so the routes do too.
 * @returns Security settings component
 */
function SecuritySettings() {
  const { t } = useTranslation();

  return (
    <div className="p-5 relative">
      <h1 className="page-title">{t("_pages:settings.links.security")}</h1>
      <Security />
    </div>
  );
}

export default SecuritySettings;

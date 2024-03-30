import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Security section
 * @returns Security component
 */
function Security() {
  const { t } = useTranslation();

  return (
    <form>
      <h2 className="text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
        {t("_pages:settings.links.security")}
      </h2>
    </form>
  );
}

export default Security;

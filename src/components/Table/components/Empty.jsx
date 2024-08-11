import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Empty component
 * @returns Empty component
 */
function Empty() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 w-full flex items-center justify-center py-2 border-t-[1px]">
      <p>{t("_accessibility:components.table.empty")}</p>
    </div>
  );
}

export default Empty;

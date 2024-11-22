import { useTranslation } from "react-i18next";

/**
 *
 * @returns Empty component
 */
const Empty = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-100 flex items-center justify-center">
      <p>{t("_pages:common.emptyEntityLevel")}</p>
    </div>
  );
};

export default Empty;

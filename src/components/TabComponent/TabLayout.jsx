import { useTranslation } from "react-i18next";

// component
import TabComponent from "./TabComponent.jsx";

/**
 *
 * @param props component properties
 * @returns tab layout
 */
export const TabLayout = (props) => {
  const { id, entity, tabs, content, name } = props;

  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {id ? `${t("_accessibility:components.form.editing")} ${name}` : t(`_pages:${entity}.newForm`)}
      </h1>
      <TabComponent tabs={tabs} content={content} />
    </>
  );
};

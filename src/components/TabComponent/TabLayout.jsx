import TabComponent from "./TabComponent.jsx";
import { useTranslation } from "react-i18next";

/**
 *
 * @param props component properties
 * @returns {JSX.Element} tab layout
 */
export const TabLayout = (props) => {
  const { id, entity, tabs, content, name } = props;

  console.log(id, entity, tabs, content);

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

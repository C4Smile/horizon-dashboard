import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { TabsLayout as SharedTabsLayout } from "@sito/dashboard-app";
import type { TabsType } from "@sito/dashboard-app";

// components
import { FormTitle } from "../FormTitle";

// types
import { TabsLayoutPropsType } from "./types.js";

/**
 * Entity form heading plus the shared tab layout. The pages hand the tabs and
 * their content in separate maps, the library takes the content inside each
 * tab, so they are zipped here.
 * @param props component properties
 * @returns tab layout
 */
export const TabsLayout = (props: TabsLayoutPropsType) => {
  const { id, entity, tabs, content, name } = props;

  const { t } = useTranslation();

  const sharedTabs = useMemo<TabsType[]>(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        content: content[tab.id] ?? null,
      })),
    [content, tabs],
  );

  return (
    <>
      <FormTitle>
        {id
          ? `${t("_accessibility:components.form.editing")} ${name}`
          : t(`_pages:${entity}.newForm`)}
      </FormTitle>
      {/* useLinks renders anchors without an href, which are not keyboard
          reachable; these tabs switch local state, so they are buttons */}
      <SharedTabsLayout tabs={sharedTabs} useLinks={false} />
    </>
  );
};

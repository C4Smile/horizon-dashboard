import { useState } from "react";

// components
import Tabs from "./Tabs";

/**
 *
 * @param {object} props - TabComponent props
 * @returns TabComponent
 */
function TabComponent(props) {
  const { tabs, content = {}, onTabChange } = props;

  const [currentTab, setCurrentTab] = useState(tabs[0]?.id);

  return (
    <div>
      <Tabs
        currentTab={currentTab}
        tabs={tabs}
        onTabClick={(id) => {
          setCurrentTab(id);
          if (onTabChange) onTabChange(id);
        }}
      />
      {content[currentTab] ? content[currentTab] : null}
    </div>
  );
}

export default TabComponent;

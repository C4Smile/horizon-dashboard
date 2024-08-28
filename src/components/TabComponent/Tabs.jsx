import React from "react";

/**
 *
 * @param {object} props - Tabs props
 * @returns Tabs component
 */
function Tabs(props) {
  const { tabs, onTabClick, currentTab } = props;

  return (
    <ul className="flex gap-5 items-center justify-start bg-slate-200 w-full p-5">
      {tabs?.map((tab) => (
        <li key={tab.id}>
          <button
            className={`text-sm ${currentTab === tab.id ? "text-light-primary/60 disabled-link" : "text-primary hover:text-dark-primary"}`}
            onClick={() => onTabClick(tab.id)}
            name={tab.label}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Tabs;

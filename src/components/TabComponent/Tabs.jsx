import React from "react";

/**
 *
 * @param {object} props - Tabs props
 * @returns Tabs component
 */
function Tabs(props) {
  const { tabs, onTabClick } = props;

  return (
    <ul>
      {tabs?.map((tab) => (
        <li key={tab.id}>
          <button onClick={onTabClick} name={tab.label}>
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Tabs;

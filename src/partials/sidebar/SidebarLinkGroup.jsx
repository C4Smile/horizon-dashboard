import React, { useState } from "react";

/**
 * SidebarLinkGroup
 * @param {object} children - React children
 * @param {boolean} activeCondition - Active condition
 * @returns {object} React component
 */
function SidebarLinkGroup({ children, activeCondition }) {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${activeCondition && "bg-slate-400 dark:bg-slate-900"}`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;

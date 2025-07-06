import { useState } from "react";

// types
import { SidebarLinkGroupPropsType } from "./types";

/**
 * SidebarLinkGroup
 * @param props - Props
 * @returns React component
 */
function SidebarLinkGroup(props: SidebarLinkGroupPropsType) {
  const { children, activeCondition } = props;
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${activeCondition && "bg-slate-300"}`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;

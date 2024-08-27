import React from "react";

/**
 * Chevron svg
 * @param props - className
 * @returns Chevron svg component
 */
function Chevron(props) {
  const { className } = props;

  return (
    <svg className={`w-3 h-3 shrink-0 fill-current ${className}`} viewBox="0 0 12 12">
      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
    </svg>
  );
}

export default Chevron;

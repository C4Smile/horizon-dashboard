import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

/**
 * Chip component
 * @param {object} props - Component props
 * @returns Chip component
 */
export default function Chip(props) {
  const { variant, label, onDelete } = props;

  const className = variant === "outlined" ? "border border-primary" : "text-white bg-primary";

  return (
    <div className={`flex items-center justify-start rounded-3xl text-sm px-4 py-2 ${className}`}>
      <span>{label}</span>
      <button type="button" className="ml-2 hover:text-secondary" onClick={onDelete}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
}

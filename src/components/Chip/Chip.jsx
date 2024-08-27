import React, { useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

/**
 * Chip component
 * @param {object} props - component props
 * @returns Chip component
 */
export default function Chip(props) {
  const { variant, label, onDelete, className, spanClassName } = props;

  const localVariant = useMemo(() => {
    switch (variant) {
      case "empty":
        return "text-primary bg-transparent";
      case "outlined":
        return "border border-primary";
      default:
        return "text-white bg-primary";
    }
  }, [variant]);

  return (
    <div
      className={`flex items-center justify-start rounded-3xl text-sm px-4 py-2 ${localVariant} ${className}`}
    >
      <span className={spanClassName}>{label}</span>
      {onDelete ? (
        <button type="button" className="ml-2 hover:text-error" onClick={onDelete}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      ) : null}
    </div>
  );
}

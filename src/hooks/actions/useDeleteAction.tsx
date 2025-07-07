import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// base
import { BaseActions, UseMultipleActionPropTypes } from "./types";

// utils
import { isDeleted, isLocked } from "utils";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

// lib
import { BaseEntityDto } from "lib";

/**
 *
 * @param props action properties
 * @returns action
 */
export const useDeleteAction = (props: UseMultipleActionPropTypes<number>) => {
  const { onClick, isLoading = false, hidden = false } = props;

  const { t } = useTranslation();

  const action = useCallback(
    (row: BaseEntityDto) => {
      return {
        id: BaseActions.Delete,
        isLoading,
        hidden: hidden || isDeleted(row) || isLocked(row),
        onClick: () => onClick([row.id]),
        icon: (
          <FontAwesomeIcon
            icon={isLoading ? faSpinner : faTrash}
            className={`text-success ${isLoading ? "rotate" : ""}`}
          />
        ),
        tooltip: t("_accessibility:buttons.delete"),
      };
    },
    [hidden, isLoading, onClick, t]
  );

  return {
    action,
  };
};

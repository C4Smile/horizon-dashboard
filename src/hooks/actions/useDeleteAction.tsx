import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// base
import { ActionHook, BaseActions, UseMultipleActionPropTypes } from "./types";

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
export const useDeleteAction = (
  props: UseMultipleActionPropTypes<number>,
): ActionHook<BaseEntityDto> => {
  const {
    onClick,
    disabled = false,
    isLoading = false,
    hidden = false,
  } = props;

  const { t } = useTranslation();

  const action = useCallback(
    (row: BaseEntityDto) => {
      return {
        id: BaseActions.Delete,
        isLoading,
        hidden: hidden || row.deleted,
        disabled: disabled || !!row.lockedBy,
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
    [disabled, hidden, isLoading, onClick, t],
  );

  return {
    action,
  };
};

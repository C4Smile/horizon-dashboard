import { useCallback } from "react";
import { Action } from "@sito/dashboard";
import { useTranslation } from "react-i18next";

// base
import { ActionHook, BaseActions, UseSingleActionPropTypes } from "./types.js";

// utils
import { isDeleted, isLocked, isLockedBy } from "utils";

// providers
import { useAccount } from "providers";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

// lib
import { BaseEntityDto } from "lib";

/**
 *
 * @param props action properties
 * @returns action
 */
export const useEditAction = (
  props: UseSingleActionPropTypes<number>
): ActionHook<BaseEntityDto> => {
  const { onClick, hidden, disabled = false } = props;

  const { t } = useTranslation();

  const { account } = useAccount();

  const action = useCallback(
    (row: BaseEntityDto): Action<BaseEntityDto> => ({
      id: BaseActions.Edit,
      disabled:
        disabled ||
        isDeleted(row) ||
        (isLocked(row) && !isLockedBy(account?.horizonUser?.id, row)),
      hidden: hidden,
      onClick: () => onClick(row.id),
      icon: <FontAwesomeIcon icon={faPencil} />,
      tooltip: t("_pages:common.actions.edit.text"),
    }),
    [account?.horizonUser?.id, disabled, hidden, onClick, t]
  );

  return {
    action,
  };
};

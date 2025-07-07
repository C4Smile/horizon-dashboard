import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// base
import { BaseActions, UseSingleActionPropTypes } from "./types.js";

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
export const useEditAction = (props: UseSingleActionPropTypes<number>) => {
  const { onClick, hidden } = props;

  const { t } = useTranslation();

  const { account } = useAccount();

  const action = useCallback(
    (row: BaseEntityDto) => ({
      id: BaseActions.Edit,
      hidden:
        hidden ||
        isDeleted(row) ||
        (isLocked(row) && !isLockedBy(account?.horizonUser?.id, row)),
      onClick: () => onClick(row.id),
      icon: <FontAwesomeIcon icon={faPencil} />,
      tooltip: t("_pages:common.actions.edit.text"),
    }),
    [account?.horizonUser?.id, hidden, onClick, t]
  );

  return {
    action,
  };
};

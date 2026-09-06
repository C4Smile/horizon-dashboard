import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ActionType } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

// base
import { ActionHook, BaseActions, UseEditActionPropTypes } from "./types.js";

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
  props: UseEditActionPropTypes,
): ActionHook<BaseEntityDto> => {
  const { url, hidden, disabled = false } = props;

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { account } = useAccount();

  const action = useCallback(
    (row: BaseEntityDto): ActionType<BaseEntityDto> => ({
      id: BaseActions.Edit,
      disabled:
        disabled ||
        isDeleted(row) ||
        (isLocked(row) && !isLockedBy(account?.horizonUser?.id, row)),
      hidden: hidden,
      onClick: () => navigate(`${url}/${row.id}`),
      icon: <FontAwesomeIcon icon={faPencil} />,
      tooltip: t("_pages:common.actions.edit.text"),
    }),
    [account?.horizonUser?.id, disabled, hidden, navigate, t, url],
  );

  return {
    action,
  };
};

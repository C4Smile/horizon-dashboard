import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// base
import { BaseActions } from "./useBaseAction.jsx";

// utils
import { isDeleted, isTableLocked, isTableLockedBy } from "../../utils/Utils.js";

// providers
import { useAccount } from "../../providers/AccountProvider.jsx";

// sitemap
import { findPath } from "../../pages/sitemap.jsx";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param props action properties
 * @returns {object} action
 */
export const useEditAction = (props) => {
  const { entity, hidden } = props;

  const { t } = useTranslation();

  const { account } = useAccount();

  const navigate = useNavigate();

  const action = useCallback(
    (row) => ({
      id: BaseActions.Edit,
      hidden:
        hidden ||
        isDeleted(row) ||
        (isTableLocked(row) && !isTableLockedBy(account?.horizonUser?.id, row)),
      onClick: () => navigate(`${findPath(entity)}/${row.id}}`),
      icon: <FontAwesomeIcon icon={faPencil} />,
      tooltip: t("_accessibility:buttons.edit"),
    }),
    [account?.horizonUser?.id, entity, hidden, navigate, t],
  );

  return {
    action,
  };
};

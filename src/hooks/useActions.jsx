import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// providers
import { useNotification } from "../providers/NotificationProvider";
import { useAccount } from "../providers/AccountProvider.jsx";

// utils
import { queryClient } from "../providers/HorizonApiProvider";

// pages
import { findPath } from "../pages/sitemap";
import { isTableLocked, isTableLockedBy } from "../utils/Utils.js";

/**
 * useActions hook
 * @param props - hook properties
 * @returns actions to render
 */
export const useActions = (props) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { account } = useAccount();
  const { setNotification } = useNotification();

  const { apiClient, queryKey, actions = [], canEdit = true, canDelete = true } = props;

  return useMemo(() => {
    const toReturn = [...actions];
    if (canEdit)
      toReturn.push({
        id: "edit",
        hidden: (entity) => isTableLocked(entity) && !isTableLockedBy(account.user.userId, entity),
        onClick: (e) => navigate(`${findPath(queryKey)}/${e.id}`),
        icon: <FontAwesomeIcon icon={faPencil} />,
        tooltip: t("_accessibility:buttons.edit"),
      });
    if (canDelete)
      toReturn.push(
        {
          id: "delete",
          hidden: (entity) => isTableLocked(entity) || entity.deleted.value,
          onClick: async (e) => {
            const result = await apiClient.delete([e.id]);
            const { error, status, data } = result;
            if (data?.count) {
              setNotification("deleted", { count: data.count });
              await queryClient.invalidateQueries({ queryKey: [queryKey] });
            } else {
              // eslint-disable-next-line no-console
              console.error(error);
              setNotification(String(status));
            }
          },
          icon: <FontAwesomeIcon icon={faTrash} />,
          tooltip: t("_accessibility:buttons.delete"),
        },
        {
          id: "restore",
          hidden: (entity) => !entity.deleted.value,
          onClick: async (e) => {
            const result = await apiClient.restore([e.id]);
            const { error, status, data } = result;
            if (data?.count) {
              setNotification("restored", { count: data.count });
              await queryClient.invalidateQueries({ queryKey: [queryKey] });
            } else {
              // eslint-disable-next-line no-console
              console.error(error);
              setNotification(String(status));
            }
          },
          icon: <FontAwesomeIcon icon={faArrowRotateLeft} />,
          tooltip: t("_accessibility:buttons.restore"),
        },
      );
    return toReturn;
  }, [account, actions, apiClient, canDelete, canEdit, navigate, queryKey, setNotification, t]);
};

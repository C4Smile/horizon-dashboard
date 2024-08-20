import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

// providers
import { queryClient } from "../../../providers/MuseumApiProvider";
import { useNotification } from "../../../providers/NotificationProvider";

/**
 * useActions hook
 * @param props - hook properties
 * @returns actions to render
 */
export const useActions = (props) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();

  const { parent, apiClient, queryKey, actions = [], canEdit = true, canDelete = true } = props;

  const getActions = useMemo(() => {
    const toReturn = [...actions];
    if (canEdit)
      toReturn.push({
        id: "edit",
        onClick: (e) => navigate(`/${parent}/${queryKey}/${e.id}`),
        icon: <FontAwesomeIcon icon={faPencil} />,
        tooltip: t("_accessibility:buttons.edit"),
      });
    if (canDelete)
      toReturn.push(
        {
          id: "delete",
          hidden: (entity) => entity.deleted.value,
          onClick: async (e) => {
            const result = await apiClient.delete([e.id]);
            const { error, status, data } = result;
            if (data?.count) {
              setNotification("deleted", { count: data.count });
              queryClient.invalidateQueries({ queryKey: [queryKey] });
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
              queryClient.invalidateQueries({ queryKey: [queryKey] });
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
  }, [actions, apiClient, canDelete, canEdit, navigate, parent, queryKey, setNotification, t]);

  return getActions;
};

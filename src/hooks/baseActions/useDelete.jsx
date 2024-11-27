import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// base
import { BaseActions } from "./useBaseAction.jsx";

// utils
import { isDeleted, isTableLocked } from "../../utils/Utils.js";

// providers
import { queryClient } from "../../providers/HorizonApiProvider.jsx";
import { useNotification } from "../../providers/NotificationProvider.jsx";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param props action properties
 * @returns {object} action
 */
export const useDeleteAction = (props) => {
  const { entity, hidden, apiClient } = props;

  const { setNotification } = useNotification();

  const { t } = useTranslation();

  const remove = useMutation({
    mutationFn: (data) => apiClient.delete([data.id]),
    onSuccess: async (result) => {
      const { error, status, data } = result;
      if (data?.count) {
        setNotification("deleted", { count: data.count });
        await queryClient.invalidateQueries({ queryKey: [entity] });
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        setNotification(String(status));
      }
    },
    onError: async (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      setNotification(error.message);
    },
  });

  const [itemId, setItemId] = useState(null);

  const action = useCallback(
    (row) => {
      const isLoading = itemId === row.id && remove.isPending;

      return {
        id: BaseActions.Delete,
        hidden: hidden || isDeleted(row) || isTableLocked(row),
        onClick: async () => {
          setItemId(row.id);
          remove.mutate({ id: row.id });
        },
        icon: (
          <FontAwesomeIcon
            icon={isLoading ? faSpinner : faTrash}
            className={`text-success ${isLoading ? "rotate" : ""}`}
          />
        ),
        tooltip: t("_accessibility:buttons.delete"),
      };
    },
    [hidden, itemId, remove, t],
  );

  return {
    action,
  };
};

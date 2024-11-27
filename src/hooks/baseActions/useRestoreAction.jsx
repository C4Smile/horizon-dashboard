import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// base
import { BaseActions } from "./types.js";

// utils
import { isDeleted } from "../../utils/Utils.js";

// providers
import { queryClient } from "../../providers/HorizonApiProvider.jsx";
import { useNotification } from "../../providers/NotificationProvider.jsx";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param props action properties
 * @returns {object} action
 */
export const useRestoreAction = (props) => {
  const { entity, hidden, apiClient } = props;

  const { setNotification } = useNotification();

  const { t } = useTranslation();

  const restore = useMutation({
    mutationFn: (data) => apiClient.restore([data.id]),
    onSuccess: async (result) => {
      const { error, status, data } = result;
      if (data?.count) {
        setNotification("restored", { count: data.count });
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
      const isLoading = itemId === row.id && restore.isPending;

      return {
        id: BaseActions.Restore,
        hidden: hidden || !isDeleted(row),
        onClick: async () => {
          setItemId(row.id);
          restore.mutate({ id: row.id });
        },
        icon: (
          <FontAwesomeIcon
            icon={isLoading ? faSpinner : faArrowRotateLeft}
            className={`text-success ${isLoading ? "rotate" : ""}`}
          />
        ),
        tooltip: t("_accessibility:buttons.restore"),
      };
    },
    [hidden, itemId, restore, t],
  );

  return {
    action,
  };
};

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification as useSharedNotification } from "@sito/dashboard-app";

// lib
import { NotificationEnumType } from "lib";

// types
import { HorizonNotificationContextType, NotificationSeverity } from "./types";

/** statuses and keys that _accessibility:messages treats as a good outcome */
const successMessages = ["200", "201", "204", "deleted", "restored"];

const severityTypes = {
  [NotificationSeverity.good]: NotificationEnumType.success,
  [NotificationSeverity.bad]: NotificationEnumType.error,
  [NotificationSeverity.ugly]: NotificationEnumType.warning,
  [NotificationSeverity.default]: NotificationEnumType.info,
};

/**
 * Shared notification context plus `setNotification`, horizon's helper that
 * resolves a status code or message key against _accessibility:messages
 * @returns notification context
 */
export const useNotification = (): HorizonNotificationContextType => {
  const shared = useSharedNotification();
  const { t } = useTranslation();

  const { showStackNotifications } = shared;

  /**
   * @param key - http status, message key of _accessibility:messages, or a ready made message
   * @param params - interpolation values, usually { model } or { count }
   * @param severity - forces the notification type, guessed from the key when omitted
   */
  const setNotification = useCallback(
    (
      key: string,
      params: Record<string, unknown> = {},
      severity?: NotificationSeverity,
    ) => {
      const messageKey = `_accessibility:messages.${key}`;
      const translated = t(messageKey, params);
      // i18next echoes the key back when there is no translation for it,
      // in that case the caller already gave us the message
      const message = translated === messageKey ? key : translated;

      const type = severity
        ? severityTypes[severity]
        : successMessages.includes(key)
          ? NotificationEnumType.success
          : NotificationEnumType.error;

      showStackNotifications([{ message, type }]);
    },
    [showStackNotifications, t],
  );

  return useMemo(
    () => ({ ...shared, setNotification }),
    [shared, setNotification],
  );
};

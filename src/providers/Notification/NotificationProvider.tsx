/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useReducer } from "react";
import { useTranslation } from "react-i18next";

// lib
import { NotificationEnumType, NotificationType } from "lib";
import {
  NotificationContextType,
  NotificationProviderPropsType,
  NotificationSeverity,
} from "./types.ts";

/** statuses and keys that _accessibility:messages treats as a good outcome */
const successMessages = ["200", "201", "204", "deleted", "restored"];

const severityTypes = {
  [NotificationSeverity.good]: NotificationEnumType.success,
  [NotificationSeverity.bad]: NotificationEnumType.error,
  [NotificationSeverity.ugly]: NotificationEnumType.warning,
  [NotificationSeverity.default]: NotificationEnumType.info,
};

const NotificationContext = createContext({} as NotificationContextType);

export function NotificationProvider(props: NotificationProviderPropsType) {
  const { children } = props;

  const { t } = useTranslation();

  const [notification, dispatch] = useReducer(
    (state, action) => {
      const { type, items, index } = action;

      switch (type) {
        case "set":
          return items.map((item: NotificationType, i: number) => ({
            ...item,
            id: i,
          }));
        case "remove":
          if (index) return state.filter((_, i) => i !== index);
          return [];
      }
      return state;
    },
    [] as NotificationType[],
    () => [] as NotificationType[],
  );

  const showErrorNotification = (options: NotificationType) =>
    dispatch({
      type: "set",
      items: [{ ...options, type: NotificationEnumType.error }],
    });

  const showNotification = (options: NotificationType) =>
    dispatch({
      type: "set",
      items: [{ ...options }],
    });

  const showStackNotifications = (notifications: NotificationType[]) =>
    dispatch({ type: "set", items: notifications });

  const showSuccessNotification = (options: NotificationType) =>
    dispatch({
      type: "set",
      items: [{ ...options, type: NotificationEnumType.success }],
    });

  const removeNotification = (index?: number) =>
    dispatch({ type: "remove", index });

  /**
   * @description Shows the message behind a status code or a message key,
   * this is what the entity forms report their result with
   * @param key - http status, message key of _accessibility:messages, or a ready made message
   * @param params - interpolation values, usually { model } or { count }
   * @param severity - forces the notification type, guessed from the key when omitted
   */
  const setNotification = (
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

    dispatch({ type: "set", items: [{ message, type }] });
  };

  return (
    <NotificationContext.Provider
      value={{
        notification,
        removeNotification,
        setNotification,
        showErrorNotification,
        showNotification,
        showSuccessNotification,
        showStackNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/**
 *
 * @returns notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined)
    throw new Error("NotificationContext must be used within a Provider");
  return context;
};

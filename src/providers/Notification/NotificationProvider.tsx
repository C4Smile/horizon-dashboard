/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useCallback } from "react";

// types
import {
  NotificationContextType,
  NotificationProviderPropsType,
  NotificationSeverity,
} from "./types";

const NotificationContext = createContext({} as NotificationContextType);

/**
 * Notification Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const NotificationProvider = (props: NotificationProviderPropsType) => {
  const { children } = props;
  const [notification, setNotification] = useState("");
  const [params, setParams] = useState({});
  const [severity, setSeverity] = useState(NotificationSeverity.good);

  /**
   *
   * @param {string} string string to parse
   * @param  {...string} params array of params
   */
  const setNotificationFunction = useCallback(
    (string: string, params = {}, severity = NotificationSeverity.good) => {
      setNotification(string);
      setParams(params);
      setSeverity(severity);
    },
    []
  );

  const value = {
    notification,
    setNotification: setNotificationFunction,
    params,
    state: severity,
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * useNotification hook
 * @returns function hook
 */
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined)
    throw new Error("notificationContext must be used within a Provider");
  return context;
};

export { NotificationProvider, useNotification };

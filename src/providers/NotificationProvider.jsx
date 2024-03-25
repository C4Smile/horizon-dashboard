/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const NotificationContext = createContext();

/**
 * Notification Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const NotificationProvider = (props) => {
  const { children } = props;
  const [notificationState, setNotificationState] = useState("");

  const value = { notificationState, setNotificationState };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useNotification hook
 * @returns function hook
 */
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) throw new Error("notificationContext must be used within a Provider");
  return context;
};

export { NotificationProvider, useNotification };

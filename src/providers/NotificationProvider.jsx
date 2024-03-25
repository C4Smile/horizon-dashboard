/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const NotificationContext = React.createContext();

const notificationReducer = (notificationState, action) => {
  switch (action.type) {
    case "hide": {
      return { notification: "" };
    }
    case "set":
      return {
        notification: action.notification,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/**
 * Notification Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const NotificationProvider = (props) => {
  const { children } = props;
  const [notificationState, setNotificationState] = React.useReducer(notificationReducer, {
    visible: false,
    type: "success",
    message: "message",
  });

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
  const context = React.useContext(NotificationContext);
  if (context === undefined) throw new Error("notificationContext must be used within a Provider");
  return context;
};

export { NotificationProvider, useNotification };

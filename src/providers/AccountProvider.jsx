/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// utils
import { toLocal, fromLocal, removeFromLocal } from "../utils/local";
import config from "../config";

const AccountContext = createContext();

/**
 * Account Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const AccountProvider = (props) => {
  const { children } = props;
  const [account, setAccount] = useState({});

  const logUser = (data) => {
    toLocal(config.user, data);
  };

  const logoutUser = () => {
    removeFromLocal(config.user);
  };

  const logUserFromLocal = () => {
    const loggedUser = fromLocal(config.user, "object");
    if (loggedUser) setAccount(loggedUser);
  };

  const value = { account, logUser, logoutUser, logUserFromLocal };
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useAccount hook
 * @returns function hook
 */
const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) throw new Error("accountContext must be used within a Provider");
  return context;
};

export { AccountProvider, useAccount };

/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useContext, useCallback, useEffect } from "react";

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

  const logUser = useCallback((data) => {
    setAccount(data);
    toLocal(config.user, data);
  }, []);

  const logoutUser = useCallback(() => {
    setAccount({});
    removeFromLocal(config.user);
  }, []);

  const logUserFromLocal = useCallback(() => {
    const loggedUser = fromLocal(config.user, "object");
    if (loggedUser) setAccount(loggedUser);
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const data = fromLocal(config.user, "object");
      setAccount(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

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

// eslint-disable-next-line react-refresh/only-export-components
export { AccountProvider, useAccount };

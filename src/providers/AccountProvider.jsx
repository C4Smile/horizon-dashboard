import { createContext, useState, useContext, useCallback } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// providers
import { useMuseumApiClient } from "./MuseumApiProvider";

// utils
import { toLocal, fromLocal, removeFromLocal } from "../utils/local";

// config
import config from "../config";

const AccountContext = createContext();

/**
 * Account Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const AccountProvider = (props) => {
  const { children } = props;

  const museumApiClient = useMuseumApiClient();

  const [account, setAccount] = useState({});

  const logUser = useCallback((data) => {
    setAccount(data);
    toLocal(config.user, data);
  }, []);

  const logoutUser = useCallback(() => {
    setAccount({});
    removeFromLocal(config.user);
  }, []);

  const logUserFromLocal = useCallback(async () => {
    try {
      const { status } = await museumApiClient.User.getSession();
      if (status === 200) {
        const loggedUser = fromLocal(config.user, "object");
        if (loggedUser) {
          const request = await museumApiClient.User.fetchOwner(loggedUser.user.id);
          const museumUser = await request.json();
          if (museumUser) setAccount({ ...loggedUser, museumUser });
          else setAccount(loggedUser);
        }
      } else logoutUser();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      logoutUser();
    }
  }, [logoutUser, museumApiClient.User]);

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

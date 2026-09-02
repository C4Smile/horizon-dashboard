import { createContext, useState, useContext, useCallback } from "react";

// providers
import { useHorizonApiClient } from "providers";

// utils
import { toLocal, fromLocal, removeFromLocal } from "utils";

// config
import config from "../../config";

// types
import { AccountContextType, AccountProviderPropsType } from "./types";

// lib
import { AccountDto } from "lib";

const AccountContext = createContext({} as AccountContextType);

/**
 * Account Provider
 * @param props - provider props
 * @returns Account Provider context
 */
const AccountProvider = (props: AccountProviderPropsType) => {
  const { children } = props;

  const horizonApiClient = useHorizonApiClient();

  const [account, setAccount] = useState<AccountDto>({} as AccountDto);

  const logUser = useCallback((data: AccountDto) => {
    setAccount(data);
    toLocal(config.user, data);
  }, []);

  const logoutUser = useCallback(() => {
    setAccount({} as AccountDto);
    removeFromLocal(config.user);
  }, []);

  const logUserFromLocal = useCallback(async () => {
    try {
      const { status } = await horizonApiClient.Auth.getSession();
      if (status === 200) {
        const loggedUser = fromLocal(config.user, "object");
        if (loggedUser) {
          const request = await horizonApiClient.Auth.fetchOwner(
            loggedUser.user.id,
          );
          const horizonUser = await request.json();
          if (horizonUser) setAccount({ ...loggedUser, horizonUser });
          else setAccount(loggedUser);
        }
      } else logoutUser();
    } catch (err) {
      console.error(err);
      logoutUser();
    }
  }, [horizonApiClient.Auth, logoutUser]);

  const value = { account, logUser, logoutUser, logUserFromLocal };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

/**
 * useAccount hook
 * @returns function hook
 */
const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined)
    throw new Error("accountContext must be used within a Provider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AccountProvider, useAccount };

import { useMemo } from "react";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// types
import { HorizonAccountType } from "./types";

/**
 * Typed view over the shared auth context, horizon carries the horizonUser
 * record alongside the standard session fields
 * @returns auth context with a horizon shaped account
 */
export const useAccount = () => {
  const { account, ...rest } = useAuth();

  const horizonAccount = useMemo(
    () => account as HorizonAccountType,
    [account],
  );

  return { ...rest, account: horizonAccount };
};

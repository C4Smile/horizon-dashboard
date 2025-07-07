import { ReactNode } from "react";

// lib
import { AccountDto } from "lib";

export type AccountContextType = {
  account: AccountDto;
  logUser: (data: AccountDto) => void;
  logoutUser: () => void;
  logUserFromLocal: () => void;
};

export type AccountProviderPropsType = {
  children: ReactNode;
};

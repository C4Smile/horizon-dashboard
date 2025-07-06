import { Dispatch, ReactNode, SetStateAction } from "react";

export type HeaderContextType = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

export type HeaderProviderPropsType = {
  children: ReactNode;
};

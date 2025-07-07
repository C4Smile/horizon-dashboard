import { Dispatch, ReactNode, SetStateAction } from "react";

export type HeaderContextType = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  tabs: ReactNode;
  setTabs: Dispatch<SetStateAction<ReactNode>>;
};

export type HeaderProviderPropsType = {
  children: ReactNode;
};

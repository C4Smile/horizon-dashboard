import HorizonApiClient from "api";
import { ReactNode } from "react";

export type HorizonProviderPropsType = {
  children: ReactNode;
};

export type HorizonContextType = {
  client: HorizonApiClient;
};

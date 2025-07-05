import { Dispatch, SetStateAction } from "react";

export type HeaderPropsTypes = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

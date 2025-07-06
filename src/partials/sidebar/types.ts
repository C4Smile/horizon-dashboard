/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from "react";

export type SidebarPropsType = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export type SidebarLinkGroupPropsType = {
  children: any;
  activeCondition: boolean;
};

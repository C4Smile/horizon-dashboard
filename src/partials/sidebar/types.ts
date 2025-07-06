/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactNode, SetStateAction } from "react";

export type SidebarPropsType = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export type SidebarLinkGroupPropsType = {
  children: any;
  activeCondition: boolean;
};

export type SidebarItem = {
  page: string;
  path: string;
  handleClick: () => void;
  open: boolean;
  icon: ReactNode;
  children:
};

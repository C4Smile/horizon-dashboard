import { ReactNode } from "react";

// lib
import { Roles } from "lib";

import { PageId } from "./sitemap";
import { MenuKeys } from "./menuMap";

export type ViewPageType = {
  key: PageId;
  component: ReactNode;
  path: string;
  role?: Roles[];
  children?: ViewPageType[];
};

export type SubMenuItemType = {
  label: string;
  path: string;
};

export type MenuItemType = {
  page: MenuKeys;
  path: string;
  icon: ReactNode;
  roles?: Roles[];
  child: SubMenuItemType[];
};

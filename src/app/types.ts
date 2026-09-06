import { ReactNode } from "react";

// lib
import { Roles } from "lib";

import { PageId } from "./sitemap";

export type ViewPageType = {
  key: PageId;
  component: ReactNode;
  path: string;
  role?: Roles[];
  children?: ViewPageType[];
};

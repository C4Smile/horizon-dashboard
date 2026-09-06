import { ReactNode } from "react";

// pages
import { PageId } from "pages";

export type TablePagePropsType = {
  children: ReactNode;
  pageKey: PageId;
  title?: string;
  noActions?: boolean;
};

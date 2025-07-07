import { PageId } from "src/pages/sitemap";

export type LinksPropsTypes = {
  pageKey: PageId;
  noInsert?: boolean;
  navClassName?: string;
  linksClassName?: string;
};

export type ModelNavigationPropsType = LinksPropsTypes;

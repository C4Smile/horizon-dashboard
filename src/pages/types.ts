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

/**
 * A tab on an entity form. `hide` decides whether the tab is offered for the
 * record at hand: the relation tabs only make sense once the entity exists.
 */
export type EntityTabType = {
  id: string;
  hide?: (isEditing: boolean) => boolean;
};

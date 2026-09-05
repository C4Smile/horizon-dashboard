// types
import { EntityTabType } from "../types";

export const shipTabs: EntityTabType[] = [
  { id: "general" },
  { id: "costs", hide: (isEditing) => isEditing },
  { id: "upkeep", hide: (isEditing) => isEditing },
  { id: "shipReqTechs", hide: (isEditing) => isEditing },
  { id: "shipReqBuildings", hide: (isEditing) => isEditing },
];

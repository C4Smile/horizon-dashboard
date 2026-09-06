// types
import { EntityTabType } from "lib";

export const cannonTabs: EntityTabType[] = [
  { id: "general" },
  { id: "costs", hide: (isEditing) => isEditing },
  { id: "cannonReqTechs", hide: (isEditing) => isEditing },
  { id: "cannonReqBuildings", hide: (isEditing) => isEditing },
];

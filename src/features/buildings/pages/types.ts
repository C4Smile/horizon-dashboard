// types
import { EntityTabType } from "lib";

export const buildingTabs: EntityTabType[] = [
  { id: "general" },
  { id: "produces", hide: (isEditing) => isEditing },
  { id: "costs", hide: (isEditing) => isEditing },
  { id: "upkeep", hide: (isEditing) => isEditing },
  { id: "buildingReqTechs", hide: (isEditing) => isEditing },
  { id: "buildingReqBuildings", hide: (isEditing) => isEditing },
];

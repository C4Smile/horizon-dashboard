import { BuildingCostDto } from "./BuildingCostDto";

export type BuildingCostAddDto = Omit<BuildingCostDto, "id">;

import { BuildingUpkeepDto } from "./BuildingUpkeepDto";

export type BuildingUpkeepAddDto = Omit<BuildingUpkeepDto, "id">;

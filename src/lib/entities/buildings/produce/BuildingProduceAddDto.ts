import { BuildingProduceDto } from "./BuildingProduceDto";

export type BuildingProduceAddDto = Omit<BuildingProduceDto, "id">;

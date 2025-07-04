import { TechCostDto } from "./TechCostDto";

export type TechCostAddDto = Omit<TechCostDto, "id">;

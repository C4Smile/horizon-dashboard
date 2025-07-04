import { TechProduceDto } from "./TechProduceDto";

export type TechProduceAddDto = Omit<TechProduceDto, "id">;

import { DeleteDto } from "../../base";

export interface TechProduceDto extends DeleteDto {
  techId: number;
  resourceId: number;
}

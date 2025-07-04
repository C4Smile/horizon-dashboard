import { DeleteDto } from "../../base";

export interface TechCostDto extends DeleteDto {
  techId: number;
  resourceId: number;
}

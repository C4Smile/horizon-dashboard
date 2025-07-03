import { DeleteDto } from "../../base";

export interface CannonCostDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

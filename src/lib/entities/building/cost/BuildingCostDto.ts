import { DeleteDto } from "../../base";

export interface BuildingCostDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

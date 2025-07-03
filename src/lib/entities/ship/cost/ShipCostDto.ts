import { DeleteDto } from "../../base";

export interface ShipCostDto extends DeleteDto {
  shipId: number;
  resourceId: number;
}

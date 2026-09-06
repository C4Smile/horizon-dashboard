import { DeleteDto } from "lib";

export interface ShipCostDto extends DeleteDto {
  shipId: number;
  resourceId: number;
}

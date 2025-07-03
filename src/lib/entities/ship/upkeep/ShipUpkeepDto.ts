import { DeleteDto } from "../../base";

export interface ShipUpkeepDto extends DeleteDto {
  shipId: number;
  resourceId: number;
}

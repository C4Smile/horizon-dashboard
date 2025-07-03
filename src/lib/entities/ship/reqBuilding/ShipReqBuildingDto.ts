import { DeleteDto } from "../../base";

export interface ShipReqBuildingDto extends DeleteDto {
  shipId: number;
  buildingId: number;
}

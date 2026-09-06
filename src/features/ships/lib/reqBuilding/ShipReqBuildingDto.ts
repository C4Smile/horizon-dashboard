import { BaseReqDto } from "lib";

export interface ShipReqBuildingDto extends BaseReqDto {
  shipId: number;
  buildingId: number;
}

import { BaseReqDto } from "lib";

export interface BuildingReqBuildingDto extends BaseReqDto {
  buildingId: number;
  buildingReqId: number;
}

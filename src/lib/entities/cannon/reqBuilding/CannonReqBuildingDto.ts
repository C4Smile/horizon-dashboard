import { BaseReqDto } from "lib";

export interface CannonReqBuildingDto extends BaseReqDto {
  cannonId: number;
  buildingId: number;
}

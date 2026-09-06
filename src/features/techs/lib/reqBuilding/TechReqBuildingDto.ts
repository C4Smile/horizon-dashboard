import { BaseReqDto } from "lib";

export interface TechReqBuildingDto extends BaseReqDto {
  techId: number;
  buildingId: number;
}

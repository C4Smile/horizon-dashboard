import { BaseReqDto } from "lib";

export interface BuildingReqTechDto extends BaseReqDto {
  buildingId: number;
  techId: number;
}

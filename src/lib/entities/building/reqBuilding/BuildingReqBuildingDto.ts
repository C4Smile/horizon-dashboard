import { DeleteDto } from "../../base";

export interface BuildingReqBuildingDto extends DeleteDto {
  buildingId: number;
  buildingReqId: number;
}

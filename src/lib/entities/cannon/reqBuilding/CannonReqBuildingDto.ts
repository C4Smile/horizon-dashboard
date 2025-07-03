import { DeleteDto } from "../../base";

export interface CannonReqBuildingDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

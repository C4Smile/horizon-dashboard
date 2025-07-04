import { DeleteDto } from "../../base";

export interface CannonReqBuildingDto extends DeleteDto {
  cannonId: number;
  buildingId: number;
}

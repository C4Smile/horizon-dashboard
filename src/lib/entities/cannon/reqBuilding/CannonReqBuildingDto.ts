import { DeleteDto } from "../../base";

export interface CannonReqBuildingDto extends DeleteDto {
  cannonId: number;
  resourceId: number;
}

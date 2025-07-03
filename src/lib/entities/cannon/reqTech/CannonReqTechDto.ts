import { DeleteDto } from "../../base";

export interface CannonReqTechDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

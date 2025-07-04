import { DeleteDto } from "../../base";

export interface TechReqBuildingDto extends DeleteDto {
  techId: number;
  buildingId: number;
}

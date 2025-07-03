import { DeleteDto } from "../../base";

export interface BuildingReqTechDto extends DeleteDto {
  buildingId: number;
  techId: number;
}

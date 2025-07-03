import { DeleteDto } from "../../base";

export interface BuildingUpkeepDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

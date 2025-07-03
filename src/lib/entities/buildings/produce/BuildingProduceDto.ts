import { DeleteDto } from "../../base";

export interface BuildingProduceDto extends DeleteDto {
  buildingId: number;
  resourceId: number;
}

import { DeleteDto } from "../../base";

export interface ShipReqTechDto extends DeleteDto {
  shipId: number;
  techId: number;
}

import { BaseReqDto } from "lib";

export interface ShipReqTechDto extends BaseReqDto {
  shipId: number;
  techId: number;
}

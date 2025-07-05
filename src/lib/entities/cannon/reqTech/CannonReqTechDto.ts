import { BaseReqDto } from "lib";

export interface CannonReqTechDto extends BaseReqDto {
  cannonId: number;
  techId: number;
}

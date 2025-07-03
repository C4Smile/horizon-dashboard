import { DeleteDto } from "../../base";

export interface CannonReqTechDto extends DeleteDto {
  cannonId: number;
  techId: number;
}

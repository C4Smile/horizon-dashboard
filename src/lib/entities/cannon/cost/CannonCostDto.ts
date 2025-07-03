import { DeleteDto } from "../../base";

export interface CannonCostDto extends DeleteDto {
  cannonId: number;
  resourceId: number;
}

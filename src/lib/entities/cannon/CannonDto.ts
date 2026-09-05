import { BaseEntityDto } from "../base";

export interface CannonDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: number;
  baseDamage: number;
  weight: number;
}

import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface ShipDto extends BaseEntityDto {
  name: string;
  description: string;
  creationTime: number;
  capacity: number;
  guns: number;
  hull: number;
  knots: number;
  minCrew: number;
  bestCrew: number;
  maxCrew: number;
  image: PhotoDto;
}

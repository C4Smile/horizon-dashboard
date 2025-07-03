import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface ShipDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  capacity: number;
  hull: number;
  knots: number;
  minCrew: number;
  bestCrew: number;
  maxCrew: number;
  image: PhotoDto;
}

import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

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
  /** optional: only ships and resources carry one */
  icon?: PhotoDto;
}

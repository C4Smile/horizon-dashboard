import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface CannonDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  image: PhotoDto;
}

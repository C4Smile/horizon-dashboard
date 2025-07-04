import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface TechTypeDto extends BaseEntityDto {
  name: string;
  urlName: string;
  image: PhotoDto;
}

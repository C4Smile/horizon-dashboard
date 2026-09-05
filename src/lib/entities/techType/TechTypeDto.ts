import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface TechTypeDto extends BaseEntityDto {
  name: string;
  image: PhotoDto;
}

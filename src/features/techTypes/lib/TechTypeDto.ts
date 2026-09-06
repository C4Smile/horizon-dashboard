import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

export interface TechTypeDto extends BaseEntityDto {
  name: string;
  image: PhotoDto;
}

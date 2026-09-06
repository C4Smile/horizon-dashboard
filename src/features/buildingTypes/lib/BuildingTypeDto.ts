import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

export interface BuildingTypeDto extends BaseEntityDto {
  name: string;
  image: PhotoDto;
}

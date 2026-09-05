import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface BuildingTypeDto extends BaseEntityDto {
  name: string;
  image: PhotoDto;
}

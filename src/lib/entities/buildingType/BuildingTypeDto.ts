import { Photo } from "src/lib/models/photo/Photo";
import { BaseEntityDto } from "../base";

export interface BuildingTypeDto extends BaseEntityDto {
  name: string;
  urlName: string;
  image: Photo;
}

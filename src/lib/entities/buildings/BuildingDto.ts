import { Photo } from "src/lib/models/photo/Photo";
import { BaseEntityDto } from "../base";
import { BuildingType } from "src/lib/models/buildingType/BuildingType";

export interface BuildingDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  type: BuildingType;
  image: Photo;
}

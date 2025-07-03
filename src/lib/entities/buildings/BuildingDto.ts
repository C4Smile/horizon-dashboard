import { Photo } from "src/lib/models/photo/Photo";
import { BaseEntityDto } from "../base";
import { BuildingTypeCommonDto } from "../buildingType";

export interface BuildingDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  type: BuildingTypeCommonDto;
  image: Photo;
}

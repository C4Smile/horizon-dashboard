import { BaseEntityDto } from "../base";
import { BuildingTypeCommonDto } from "../buildingType";
import { PhotoDto } from "../photo";

export interface BuildingDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  type: BuildingTypeCommonDto;
  image: PhotoDto;
}

import { BaseEntityDto } from "../base";
import { BuildingTypeCommonDto } from "../buildingType";
import { PhotoDto } from "../photo";

export interface BuildingDto extends BaseEntityDto {
  name: string;
  description: string;
  creationTime: number;
  type: BuildingTypeCommonDto;
  typeId: number;
  image: PhotoDto;
}

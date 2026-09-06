import { BaseEntityDto } from "lib";
import { BuildingTypeCommonDto } from "features/buildingTypes";
import { PhotoDto } from "lib";

export interface BuildingDto extends BaseEntityDto {
  name: string;
  description: string;
  creationTime: number;
  type: BuildingTypeCommonDto;
  typeId: number;
  image: PhotoDto;
}

import { BaseEntityDto } from "../base";
import { TechTypeCommonDto } from "../buildingType";
import { PhotoDto } from "../photo";

export interface TechDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  type: TechTypeCommonDto;
  image: PhotoDto;
}

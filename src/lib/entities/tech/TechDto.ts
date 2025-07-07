import { TechTypeCommonDto } from "lib";
import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface TechDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;
  typeId: number;
  type: TechTypeCommonDto;
  image: PhotoDto;
}

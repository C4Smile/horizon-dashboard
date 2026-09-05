import { TechTypeCommonDto } from "lib";
import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface TechDto extends BaseEntityDto {
  name: string;
  description: string;
  creationTime: number;
  typeId: number;
  type: TechTypeCommonDto;
  image: PhotoDto;
}

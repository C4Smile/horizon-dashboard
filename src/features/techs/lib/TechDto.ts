import { TechTypeCommonDto } from "features/techTypes";
import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

export interface TechDto extends BaseEntityDto {
  name: string;
  description: string;
  creationTime: number;
  typeId: number;
  type: TechTypeCommonDto;
  image: PhotoDto;
}

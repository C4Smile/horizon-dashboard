import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface ResourceDto extends BaseEntityDto {
  name: string;
  description: string;
  baseFactor: number;
  image: PhotoDto;
}

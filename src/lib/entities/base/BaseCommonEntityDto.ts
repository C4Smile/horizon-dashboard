import { DeleteDto, PhotoDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  name: string;
  /** the iso string the api serialises, same as BaseEntityDto */
  updatedAt: string;
  image: PhotoDto;
}

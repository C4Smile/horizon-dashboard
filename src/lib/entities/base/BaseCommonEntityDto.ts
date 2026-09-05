import { DeleteDto, PhotoDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  name: string;
  /** the iso string the api serialises, same as BaseEntityDto */
  updatedAt: string;
  /** optional: cannons, for one, have no image column at all */
  image?: PhotoDto;
}

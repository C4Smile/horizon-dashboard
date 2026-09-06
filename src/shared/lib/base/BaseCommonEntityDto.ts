import { DeleteDto, PhotoDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  name: string;
  /** declared Date to match the library, arrives as an iso string */
  updatedAt: Date;
  /** optional: cannons, for one, have no image column at all */
  image?: PhotoDto;
}

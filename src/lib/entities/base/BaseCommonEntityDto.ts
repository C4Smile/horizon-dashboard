import { DeleteDto, PhotoDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  name: string;
  updatedAt: Date;
  image: PhotoDto;
}

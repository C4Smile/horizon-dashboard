import { DeleteDto, PhotoDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  name: string;
  lastUpdate: Date;
  image: PhotoDto;
}

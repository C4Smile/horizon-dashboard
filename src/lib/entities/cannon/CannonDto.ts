import { Photo } from "src/lib/models/photo/Photo";
import { BaseEntityDto } from "../base";

export interface CannonDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  creationTime: string;

  image: Photo;
}

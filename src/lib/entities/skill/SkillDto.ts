import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface SkillDto extends BaseEntityDto {
  name: string;
  urlName: string;
  description: string;
  image: PhotoDto;
}

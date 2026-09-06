import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

export interface SkillDto extends BaseEntityDto {
  name: string;
  description: string;
  image: PhotoDto;
}

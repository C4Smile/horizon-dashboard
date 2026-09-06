import { BaseEntityDto } from "lib";
import { PhotoDto } from "lib";

export interface ResourceDto extends BaseEntityDto {
  name: string;
  description: string;
  baseFactor: number;
  image: PhotoDto;
  /** optional: only ships and resources carry one */
  icon?: PhotoDto;
}

import { OmitBaseEntityDto } from "../base";
import { TechDto } from "./TechDto";

export interface TechAddDto extends Omit<TechDto, OmitBaseEntityDto | "type"> {
  typeId: number;
}

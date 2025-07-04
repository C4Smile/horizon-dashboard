import { BaseFilterDto } from "../base";
import { TechDto } from "./TechDto";

export interface TechFilterDto
  extends Omit<TechDto, "type">,
    BaseFilterDto {
  typeId: number[];
}

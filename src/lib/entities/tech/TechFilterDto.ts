import { BaseFilterDto } from "../base";
import { TechDto } from "./TechDto";

export interface TechFilterDto
  extends Partial<Omit<TechDto, "deleted" | "typeId">>, BaseFilterDto {
  typeId?: number[];
}

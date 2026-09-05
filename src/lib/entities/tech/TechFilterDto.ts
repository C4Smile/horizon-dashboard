import { BaseFilterDto } from "../base";
import { TechDto } from "./TechDto";

export interface TechFilterDto
  extends Partial<Omit<TechDto, "deletedAt" | "typeId">>, BaseFilterDto {
  typeId?: number[];
}

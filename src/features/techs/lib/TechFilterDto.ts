import { BaseFilterDto } from "lib";
import { TechDto } from "./TechDto";

export interface TechFilterDto
  extends Partial<Omit<TechDto, "deletedAt" | "typeId">>, BaseFilterDto {
  typeId?: number[];
}

import { BaseFilterDto } from "lib";
import { BuildingDto } from "./BuildingDto";

export interface BuildingFilterDto
  extends Partial<Omit<BuildingDto, "type" | "typeId">>, BaseFilterDto {
  typeId?: number[];
}

import { BaseFilterDto } from "../base";
import { BuildingDto } from "./BuildingDto";

export interface BuildingFilterDto
  extends Omit<BuildingDto, "type">,
    BaseFilterDto {
  typeId: number[];
}

import { BaseFilterDto } from "lib";
import { BuildingUpkeepDto } from "./BuildingUpkeepDto";

export interface BuildingUpkeepFilterDto
  extends BuildingUpkeepDto, BaseFilterDto {}

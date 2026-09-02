import { BaseFilterDto } from "../../base";
import { BuildingUpkeepDto } from "./BuildingUpkeepDto";

export interface BuildingUpkeepFilterDto
  extends BuildingUpkeepDto, BaseFilterDto {}

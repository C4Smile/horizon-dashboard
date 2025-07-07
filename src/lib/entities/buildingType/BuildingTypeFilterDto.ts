import { BaseFilterDto } from "../base";
import { BuildingTypeDto } from "./BuildingTypeDto";

export interface BuildingTypeFilterDto
  extends Partial<Omit<BuildingTypeDto, "deleted">>,
    BaseFilterDto {}

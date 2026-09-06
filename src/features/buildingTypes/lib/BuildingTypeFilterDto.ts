import { BaseFilterDto } from "lib";
import { BuildingTypeDto } from "./BuildingTypeDto";

export interface BuildingTypeFilterDto
  extends Partial<Omit<BuildingTypeDto, "deletedAt">>, BaseFilterDto {}

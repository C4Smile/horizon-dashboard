import { BaseFilterDto } from "lib";
import { TechTypeDto } from "./TechTypeDto";

export interface TechTypeFilterDto
  extends Partial<Omit<TechTypeDto, "deletedAt">>, BaseFilterDto {}

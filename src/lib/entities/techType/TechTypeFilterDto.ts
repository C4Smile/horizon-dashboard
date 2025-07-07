import { BaseFilterDto } from "../base";
import { TechTypeDto } from "./TechTypeDto";

export interface TechTypeFilterDto
  extends Partial<Omit<TechTypeDto, "deleted">>,
    BaseFilterDto {}

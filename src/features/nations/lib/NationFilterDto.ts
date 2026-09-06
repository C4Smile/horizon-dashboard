import { BaseFilterDto } from "lib";
import { NationDto } from "./NationDto";

export interface NationFilterDto
  extends Partial<Omit<NationDto, "deletedAt">>, BaseFilterDto {}

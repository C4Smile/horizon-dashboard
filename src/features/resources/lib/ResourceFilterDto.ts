import { BaseFilterDto } from "lib";
import { ResourceDto } from "./ResourceDto";

export interface ResourceFilterDto
  extends Partial<ResourceDto>, BaseFilterDto {}

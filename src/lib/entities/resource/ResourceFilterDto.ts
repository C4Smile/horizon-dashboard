import { BaseFilterDto } from "../base";
import { ResourceDto } from "./ResourceDto";

export interface ResourceFilterDto
  extends Partial<ResourceDto>,
    BaseFilterDto {}

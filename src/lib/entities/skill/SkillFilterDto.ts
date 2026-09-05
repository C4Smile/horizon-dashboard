import { BaseFilterDto } from "../base";
import { SkillDto } from "./SkillDto";

export interface SkillFilterDto extends Partial<SkillDto>, BaseFilterDto {}

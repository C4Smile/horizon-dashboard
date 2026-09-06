import { BaseFilterDto } from "lib";
import { SkillDto } from "./SkillDto";

export interface SkillFilterDto extends Partial<SkillDto>, BaseFilterDto {}

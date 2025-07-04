import { OmitBaseEntityDto } from "../base";
import { SkillDto } from "./SkillDto";

export type SkillAddDto = Omit<SkillDto, OmitBaseEntityDto>;

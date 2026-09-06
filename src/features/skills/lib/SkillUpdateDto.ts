import { DeleteDto } from "lib";
import { SkillAddDto } from "./SkillAddDto";

/** The same payload as a create, plus the id of the row being written */
export type SkillUpdateDto = SkillAddDto & DeleteDto;

import { DeleteDto } from "../base";
import { TechTypeAddDto } from "./TechTypeAddDto";

/** The same payload as a create, plus the id of the row being written */
export type TechTypeUpdateDto = TechTypeAddDto & DeleteDto;

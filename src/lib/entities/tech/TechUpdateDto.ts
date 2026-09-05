import { DeleteDto } from "../base";
import { TechAddDto } from "./TechAddDto";

/** The same payload as a create, plus the id of the row being written */
export type TechUpdateDto = TechAddDto & DeleteDto;

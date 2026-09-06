import { DeleteDto } from "lib";
import { NationAddDto } from "./NationAddDto";

/** The same payload as a create, plus the id of the row being written */
export type NationUpdateDto = NationAddDto & DeleteDto;

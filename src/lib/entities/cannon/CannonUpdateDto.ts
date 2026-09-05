import { DeleteDto } from "../base";
import { CannonAddDto } from "./CannonAddDto";

/** The same payload as a create, plus the id of the row being written */
export type CannonUpdateDto = CannonAddDto & DeleteDto;

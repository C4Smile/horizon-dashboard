import { DeleteDto } from "../base";
import { ShipAddDto } from "./ShipAddDto";

/** The same payload as a create, plus the id of the row being written */
export type ShipUpdateDto = ShipAddDto & DeleteDto;

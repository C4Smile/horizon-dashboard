import { DeleteDto } from "../base";
import { BuildingAddDto } from "./BuildingAddDto";

/** The same payload as a create, plus the id of the row being written */
export type BuildingUpdateDto = BuildingAddDto & DeleteDto;

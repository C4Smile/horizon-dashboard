import { DeleteDto } from "lib";
import { BuildingAddDto } from "./BuildingAddDto";

/** The same payload as a create, plus the id of the row being written */
export type BuildingUpdateDto = BuildingAddDto & DeleteDto;

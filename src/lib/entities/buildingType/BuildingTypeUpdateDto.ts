import { DeleteDto } from "../base";
import { BuildingTypeAddDto } from "./BuildingTypeAddDto";

/** The same payload as a create, plus the id of the row being written */
export type BuildingTypeUpdateDto = BuildingTypeAddDto & DeleteDto;

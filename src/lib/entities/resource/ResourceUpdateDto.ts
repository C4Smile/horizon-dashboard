import { DeleteDto } from "../base";
import { ResourceAddDto } from "./ResourceAddDto";

/** The same payload as a create, plus the id of the row being written */
export type ResourceUpdateDto = ResourceAddDto & DeleteDto;

import { DeleteDto } from "lib";
import { ResourceAddDto } from "./ResourceAddDto";

/** The same payload as a create, plus the id of the row being written */
export type ResourceUpdateDto = ResourceAddDto & DeleteDto;

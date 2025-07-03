import { OmitBaseEntityDto } from "../base";
import { BuildingDto } from "./BuildingDto";

export interface BuildingAddDto
  extends Omit<BuildingDto, OmitBaseEntityDto | "type"> {
  typeId: number;
}

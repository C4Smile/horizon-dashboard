import { OmitBaseEntityDto } from "../base";
import { CannonDto } from "./CannonDto";

export interface CannonAddDto
  extends Omit<CannonDto, OmitBaseEntityDto | "type"> {
  typeId: number;
}

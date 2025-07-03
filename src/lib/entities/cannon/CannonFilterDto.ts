import { BaseFilterDto } from "../base";
import { CannonDto } from "./CannonDto";

export interface CannonFilterDto
  extends Omit<CannonDto, "type">,
    BaseFilterDto {
  typeId: number[];
}

import { BaseFilterDto } from "lib";
import { CannonDto } from "./CannonDto";

export interface CannonFilterDto
  extends Partial<Omit<CannonDto, "type" | "typeId">>, BaseFilterDto {
  typeId?: number[];
}

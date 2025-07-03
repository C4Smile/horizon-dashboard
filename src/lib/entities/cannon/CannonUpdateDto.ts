import { CannonDto } from "./CannonDto";

export interface CannonUpdateDto extends Omit<CannonDto, "type"> {
  typeId: number;
}

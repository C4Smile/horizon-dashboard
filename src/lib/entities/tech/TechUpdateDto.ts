import { TechDto } from "./TechDto";

export interface TechUpdateDto extends Omit<TechDto, "type"> {
  typeId: number;
}

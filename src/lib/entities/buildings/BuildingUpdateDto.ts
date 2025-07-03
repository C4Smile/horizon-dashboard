import { BuildingDto } from "./BuildingDto";

export interface BuildingUpdateDto extends Omit<BuildingDto, "type"> {
  typeId: number;
}

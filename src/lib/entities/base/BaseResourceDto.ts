import { ResourceCommonDto } from "../resource";
import { DeleteDto } from "./DeleteDto";

export interface BaseResourceDto extends DeleteDto {
  resourceId: number;
  base: number;
  factor: number;
  resource: ResourceCommonDto;
}

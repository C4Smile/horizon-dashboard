import { DeleteDto } from "./DeleteDto";

export interface BaseResourceDto extends DeleteDto {
  resourceId: number;
}

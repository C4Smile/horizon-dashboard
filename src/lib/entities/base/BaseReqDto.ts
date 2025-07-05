import { DeleteDto } from "./DeleteDto";

export interface BaseReqDto extends DeleteDto {
  level: number;
}

import { BaseCommonEntityDto } from "./BaseCommonEntityDto";
import { DeleteDto } from "./DeleteDto";

export interface BaseResourceDto extends DeleteDto {
  resourceId: number;
  base: number;
  factor: number;
  // the resource as the api nests it; ResourceCommonDto is this same shape,
  // named in the feature. shared cannot reach into a feature, so it says it here
  resource: BaseCommonEntityDto;
}

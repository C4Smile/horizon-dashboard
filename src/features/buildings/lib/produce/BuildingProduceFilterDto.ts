import { BaseFilterDto } from "lib";
import { BuildingProduceDto } from "./BuildingProduceDto";

export interface BuildingProduceFilterDto
  extends BuildingProduceDto, BaseFilterDto {}

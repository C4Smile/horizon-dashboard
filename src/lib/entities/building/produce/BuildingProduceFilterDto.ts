import { BaseFilterDto } from "../../base";
import { BuildingProduceDto } from "./BuildingProduceDto";

export interface BuildingProduceFilterDto
  extends BuildingProduceDto, BaseFilterDto {}

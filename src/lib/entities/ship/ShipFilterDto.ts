import { BaseFilterDto } from "../base";
import { ShipDto } from "./ShipDto";

export interface ShipFilterDto extends Partial<ShipDto>, BaseFilterDto {}

import { BaseFilterDto } from "lib";
import { ShipDto } from "./ShipDto";

export interface ShipFilterDto extends Partial<ShipDto>, BaseFilterDto {}

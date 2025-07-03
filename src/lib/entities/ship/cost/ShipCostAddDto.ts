import { ShipCostDto } from "./ShipCostDto";

export type ShipCostAddDto = Omit<ShipCostDto, "id">;

import { ShipUpkeepDto } from "./ShipUpkeepDto";

export type ShipUpkeepAddDto = Omit<ShipUpkeepDto, "id">;

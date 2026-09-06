import { ShipUpkeepDto } from "./ShipUpkeepDto";

/**
 * What the api takes to create the relation. The owning entity travels in
 * the url and the joined record is read side only.
 */
export type ShipUpkeepAddDto = Omit<ShipUpkeepDto, "id" | "shipId">;

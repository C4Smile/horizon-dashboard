import { ShipReqTechDto } from "./ShipReqTechDto";

/**
 * What the api takes to create the relation. The owning entity travels in
 * the url and the joined record is read side only.
 */
export type ShipReqTechAddDto = Omit<ShipReqTechDto, "id" | "shipId">;

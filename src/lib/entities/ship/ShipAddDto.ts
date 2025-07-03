import { OmitBaseEntityDto } from "../base";
import { ShipDto } from "./ShipDto";

export type ShipAddDto = Omit<ShipDto, OmitBaseEntityDto>;

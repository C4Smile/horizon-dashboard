import { ImageWriteDto, OmitBaseEntityDto } from "../base";
import { ShipDto } from "./ShipDto";

/** What the api takes to create a ship */
export type ShipAddDto = Omit<
  ShipDto,
  OmitBaseEntityDto | "image"
> &
  ImageWriteDto;

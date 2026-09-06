import { IconWriteDto, ImageWriteDto, OmitBaseEntityDto } from "lib";
import { ShipDto } from "./ShipDto";

/** What the api takes to create a ship */
export type ShipAddDto = Omit<
  ShipDto,
  OmitBaseEntityDto | "image" | "icon"
> &
  ImageWriteDto &
  IconWriteDto;

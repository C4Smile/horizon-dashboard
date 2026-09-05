import { ImageWriteDto, OmitBaseEntityDto } from "../base";
import { BuildingDto } from "./BuildingDto";

/** What the api takes to create a building */
export type BuildingAddDto = Omit<
  BuildingDto,
  OmitBaseEntityDto | "image" | "type"
> &
  ImageWriteDto & {
  typeId: number;
  };

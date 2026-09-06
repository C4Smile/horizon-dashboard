import { ImageWriteDto, OmitBaseEntityDto } from "lib";
import { NationDto } from "./NationDto";

/** What the api takes to create a nation */
export type NationAddDto = Omit<NationDto, OmitBaseEntityDto | "image"> &
  ImageWriteDto;

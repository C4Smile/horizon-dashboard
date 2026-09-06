import { ImageWriteDto, OmitBaseEntityDto } from "lib";
import { TechTypeDto } from "./TechTypeDto";

/** What the api takes to create a techtype */
export type TechTypeAddDto = Omit<
  TechTypeDto,
  OmitBaseEntityDto | "image"
> &
  ImageWriteDto;

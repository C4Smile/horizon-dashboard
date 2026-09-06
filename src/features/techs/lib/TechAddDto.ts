import { ImageWriteDto, OmitBaseEntityDto } from "lib";
import { TechDto } from "./TechDto";

/** What the api takes to create a tech */
export type TechAddDto = Omit<TechDto, OmitBaseEntityDto | "image" | "type"> &
  ImageWriteDto & {
    typeId: number;
  };

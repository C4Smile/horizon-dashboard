import { IconWriteDto, ImageWriteDto, OmitBaseEntityDto } from "../base";
import { ResourceDto } from "./ResourceDto";

/** What the api takes to create a resource */
export type ResourceAddDto = Omit<
  ResourceDto,
  OmitBaseEntityDto | "image" | "icon"
> &
  ImageWriteDto &
  IconWriteDto;

import { ImageWriteDto, OmitBaseEntityDto } from "lib";
import { SkillDto } from "./SkillDto";

/** What the api takes to create a skill */
export type SkillAddDto = Omit<
  SkillDto,
  OmitBaseEntityDto | "image"
> &
  ImageWriteDto;

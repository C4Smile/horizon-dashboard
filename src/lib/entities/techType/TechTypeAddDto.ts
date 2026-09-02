import { OmitBaseEntityDto } from "../base";
import { TechTypeDto } from "./TechTypeDto";

export type TechTypeAddDto = Omit<TechTypeDto, OmitBaseEntityDto>;

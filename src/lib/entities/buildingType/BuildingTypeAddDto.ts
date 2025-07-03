import { OmitBaseEntityDto } from "../base";
import { BuildingTypeDto } from "./BuildingTypeDto";

export type BuildingTypeAddDto = Omit<BuildingTypeDto, OmitBaseEntityDto>

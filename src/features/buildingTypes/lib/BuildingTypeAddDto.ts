import { OmitBaseEntityDto } from "lib";
import { BuildingTypeDto } from "./BuildingTypeDto";

/** What the api takes to create a buildingtype */
export type BuildingTypeAddDto = Omit<BuildingTypeDto, OmitBaseEntityDto>;

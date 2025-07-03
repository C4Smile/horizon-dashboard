import { OmitBaseEntityDto } from "../base";
import { ResourceDto } from "./ResourceDto";

export type ResourceAddDto = Omit<ResourceDto, OmitBaseEntityDto>;

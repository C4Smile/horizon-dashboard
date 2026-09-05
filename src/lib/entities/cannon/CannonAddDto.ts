import { OmitBaseEntityDto } from "../base";
import { CannonDto } from "./CannonDto";

/** What the api takes to create a cannon. Cannons carry no image. */
export type CannonAddDto = Omit<CannonDto, OmitBaseEntityDto>;

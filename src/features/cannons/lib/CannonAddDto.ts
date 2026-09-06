import { OmitBaseEntityDto } from "lib";
import { CannonDto } from "./CannonDto";

/** What the api takes to create a cannon. Cannons carry no image. */
export type CannonAddDto = Omit<CannonDto, OmitBaseEntityDto>;

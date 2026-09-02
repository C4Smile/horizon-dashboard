import { OmitBaseEntityDto } from "../base";
import { UserDto } from "./UserDto";

export type UserAddDto = Omit<UserDto, OmitBaseEntityDto>;

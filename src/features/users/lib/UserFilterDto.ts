import { BaseFilterDto } from "lib";
import { UserDto } from "./UserDto";

export interface UserFilterDto extends Partial<UserDto>, BaseFilterDto {}

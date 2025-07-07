import { BaseFilterDto } from "../base";
import { UserDto } from "./UserDto";

export interface UserFilterDto extends Partial<UserDto>, BaseFilterDto {}

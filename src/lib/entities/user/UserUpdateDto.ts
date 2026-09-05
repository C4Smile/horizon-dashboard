import { DeleteDto } from "../base";
import { UserAddDto } from "./UserTypeAddDto";

/** The same payload as a create, plus the id of the row being written */
export type UserUpdateDto = UserAddDto & DeleteDto;

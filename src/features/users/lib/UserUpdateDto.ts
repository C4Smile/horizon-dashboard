import { DeleteDto } from "lib";
import { UserAddDto } from "./UserTypeAddDto";

/**
 * The id of the row being written plus whatever changed. The api patches by
 * merging, so a screen that only changes the password sends only that.
 */
export type UserUpdateDto = Partial<UserAddDto> & DeleteDto;

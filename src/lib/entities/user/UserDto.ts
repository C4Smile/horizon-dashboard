import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

/** A horizon user as the api answers it */
export interface UserDto extends BaseEntityDto {
  username: string;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  imageId: number;
  image: PhotoDto;
  /** id of the auth user this horizon user is linked to */
  userId: number;
}

/**
 * What the user forms hold: the record plus the credential fields, which are
 * typed in but never answered back.
 */
export interface UserFormType extends Partial<UserDto> {
  password?: string;
  rPassword?: string;
  /** collected by the account form, the api does not store it */
  address?: string;
}

import { BaseEntityDto } from "../base";
import { PhotoDto } from "../photo";

export interface UserDto extends BaseEntityDto {
  username: string;
  password: string;
  rPassword: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  urlName: string;
  image: PhotoDto;
  roleId: number;
}

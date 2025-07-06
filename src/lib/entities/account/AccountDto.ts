import { UserDto } from "lib";

export type AccountDto = {
  name: string;
  user: UserDto;
  horizonUser: UserDto;
};

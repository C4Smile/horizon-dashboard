import { UserDto } from "features/users";

export type AccountDto = {
  name: string;
  user: UserDto;
  horizonUser: UserDto;
};

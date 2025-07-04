import { UserDto } from "./UserDto";

export type UserCommonDto = Omit<
  UserDto,
  "deleted" | "createdAt"
>;

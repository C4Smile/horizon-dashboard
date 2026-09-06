import { ImageWriteDto, OmitBaseEntityDto } from "lib";
import { UserDto } from "./UserDto";

/** What the api takes to create a horizon user */
export type UserAddDto = Omit<
  UserDto,
  OmitBaseEntityDto | "image" | "imageId" | "userId"
> &
  ImageWriteDto & {
    password?: string;
  };

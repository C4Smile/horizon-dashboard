// base
import { BaseApiClient } from "./utils/BaseApiClient";
import { User } from "src/lib/models/user/User";
import { Photo } from "src/lib/models/photo/Photo";

// lib
import {
  UserDto,
  UserCommonDto,
  UserAddDto,
  UserUpdateDto,
  UserFilterDto,
} from "lib";
import { Tables } from "./types";

/**
 * @class UserApiClient
 * @description UserApiClient
 */
export class UserApiClient extends BaseApiClient<
  UserDto,
  UserCommonDto,
  UserAddDto,
  UserUpdateDto,
  UserFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.Users);
  }

  /**
   * @description Create user
   * @param user - User
   * @param photo - User photo
   * @returns  Transaction status
   */
  async create(user: User, photo: Photo) {
    // deleting rPassword
    delete user.rPassword;
    // saving image
    if (photo) user.image = photo;
  }

  /**
   * @description Create user
   * @param user - User
   * @param photo - User photo
   * @returns Transaction status
   */
  async update(user: User, photo: Photo) {
    // deleting rPassword
    delete user.rPassword;
    // saving photo
    if (photo) user.image = photo;
  }
}

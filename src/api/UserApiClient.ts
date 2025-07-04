// utils
import { BaseApiClient } from "./utils/";

// types
import { Tables } from "./types";

// lib
import {
  UserDto,
  UserCommonDto,
  UserAddDto,
  UserUpdateDto,
  UserFilterDto,
} from "lib";

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

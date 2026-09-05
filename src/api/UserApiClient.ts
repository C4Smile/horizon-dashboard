// base
import { BaseApiClient } from "./utils/BaseApiClient";
import { FormPhoto, parseId, parseImage } from "./utils/formToDto";

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
   * @description Maps the form values to what the api stores. rPassword only
   * exists to confirm the typed password, it never travels.
   * @param user - form values
   * @param photo - ImageUploader state
   * @returns user dto
   */
  private toDto(user: UserDto, photo: FormPhoto) {
    const { name, username, email, phone, address, password } = user;

    return {
      name,
      username,
      email,
      phone,
      address,
      roleId: parseId(user.roleId),
      ...(password ? { password } : {}),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create user
   * @param user - form values
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(user: UserDto, photo: FormPhoto) {
    return await this.saveNew(this.toDto(user, photo) as UserAddDto);
  }

  /**
   * @description Update user
   * @param user - form values
   * @param photo - photo
   * @returns Transaction status
   */
  async update(user: UserDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: user.id,
      ...this.toDto(user, photo),
    } as UserUpdateDto);
  }
}

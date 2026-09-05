// base
import { BaseApiClient } from "./utils/BaseApiClient";
import { FormPhoto, parseId, parseImage } from "./utils/formToDto";

// types
import { Tables } from "./types";

// lib
import {
  UserDto,
  UserFormType,
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
  private toDto(user: UserFormType, photo: FormPhoto) {
    const { name, username, email, phone, password } = user;

    return {
      name: name ?? "",
      username: username ?? "",
      email: email ?? "",
      phone: phone ?? "",
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
  async createFromForm(user: UserFormType, photo: FormPhoto) {
    return await this.saveNew(this.toDto(user, photo));
  }

  /**
   * @description Update user
   * @param user - form values
   * @param photo - photo
   * @returns Transaction status
   */
  async updateFromForm(user: UserFormType, photo: FormPhoto) {
    return await this.saveExisting({
      id: user.id ?? 0,
      ...this.toDto(user, photo),
    });
  }
}

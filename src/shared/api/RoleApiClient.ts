// utils
import { BaseApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { BaseCommonEntityDto, BaseEntityDto, BaseFilterDto } from "lib";

export interface RoleDto extends BaseEntityDto {
  name: string;
}

/**
 * @class RoleApiClient
 * @description Reads the horizon roles a user can be given
 */
export class RoleApiClient extends BaseApiClient<
  RoleDto,
  BaseCommonEntityDto,
  RoleDto,
  RoleDto,
  BaseFilterDto
> {
  constructor() {
    super(Tables.Roles);
  }
}

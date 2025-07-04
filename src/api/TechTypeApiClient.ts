import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";

// type
import { Tables } from "./types/dbUtils.js";

// lib
import {
  TechTypeDto,
  TechTypeCommonDto,
  TechTypeAddDto,
  TechTypeUpdateDto,
  TechTypeFilterDto,
} from "lib";

/**
 * @class TechTypeApiClient
 * @description TechTypeApiClient
 */
export class TechTypeApiClient extends BaseApiClient<
  TechTypeDto,
  TechTypeCommonDto,
  TechTypeAddDto,
  TechTypeUpdateDto,
  TechTypeFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.TechTypes);
  }

  /**
   * @description Create techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(techType: TechType, photo: Photo) {
    // default values
    techType.urlName = toSlug(techType.name);
    // saving photo
    if (photo) techType.image = photo;
  }

  /**
   * @description Update techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(techType: TechType, photo: Photo) {
    // default values
    techType.urlName = toSlug(techType.name);
    // saving photo
    if (photo) techType.image = photo;
  }
}

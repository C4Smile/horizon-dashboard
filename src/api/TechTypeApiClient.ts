import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";
import { FormPhoto, parseImage } from "./utils/formToDto";

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
   * @description Maps the form values to what the api stores
   * @param techType - form values
   * @param photo - ImageUploader state
   * @returns techType dto
   */
  private toDto(techType: TechTypeDto, photo: FormPhoto) {
    return {
      name: techType.name,
      urlName: toSlug(techType.name),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(techType: TechTypeDto, photo: FormPhoto) {
    return await this.saveNew(this.toDto(techType, photo) as TechTypeAddDto);
  }

  /**
   * @description Update techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(techType: TechTypeDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: techType.id,
      ...this.toDto(techType, photo),
    } as TechTypeUpdateDto);
  }
}

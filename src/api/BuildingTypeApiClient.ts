import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";
import { FormPhoto, parseImage } from "./utils/formToDto";

// types
import { Tables } from "./types";

// lib
import {
  BuildingTypeDto,
  BuildingTypeCommonDto,
  BuildingTypeAddDto,
  BuildingTypeUpdateDto,
  BuildingTypeFilterDto,
} from "lib";

/**
 * @class BuildingTypeApiClient
 * @description BuildingTypeApiClient
 */
export class BuildingTypeApiClient extends BaseApiClient<
  BuildingTypeDto,
  BuildingTypeCommonDto,
  BuildingTypeAddDto,
  BuildingTypeUpdateDto,
  BuildingTypeFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.BuildingTypes);
  }

  /**
   * @description Maps the form values to what the api stores
   * @param buildingType - form values
   * @param photo - ImageUploader state
   * @returns buildingType dto
   */
  private toDto(buildingType: BuildingTypeDto, photo: FormPhoto) {
    return {
      name: buildingType.name,
      urlName: toSlug(buildingType.name),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create buildingType
   * @param buildingType - BuildingType
   * @param photo - Photo
   * @returns Transaction status
   */
  async createFromForm(buildingType: BuildingTypeDto, photo: FormPhoto) {
    return await this.saveNew(
      this.toDto(buildingType, photo),
    );
  }

  /**
   * @description Update buildingType
   * @param buildingType - BuildingType
   * @param photo - Photo
   * @returns Transaction status
   */
  async updateFromForm(buildingType: BuildingTypeDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: buildingType.id,
      ...this.toDto(buildingType, photo),
    });
  }
}

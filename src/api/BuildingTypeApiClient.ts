
// base
import { BaseApiClient } from "./utils/";
import { FormPhoto, parseImage, parseNumber } from "./utils/formToDto";

// types
import { Tables } from "./types";

// lib
import {
  BuildingTypeAddDto,
  BuildingTypeCommonDto,
  BuildingTypeDto,
  BuildingTypeFilterDto,
  BuildingTypeUpdateDto,
  FormValues,
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
  private toDto(buildingType: FormValues<BuildingTypeDto>, photo: FormPhoto) {
    return {
      name: buildingType.name ?? "",
      ...parseImage(photo),
    };
  }

  /**
   * @description Create buildingType
   * @param buildingType - BuildingType
   * @param photo - Photo
   * @returns Transaction status
   */
  async createFromForm(buildingType: FormValues<BuildingTypeDto>, photo: FormPhoto) {
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
  async updateFromForm(buildingType: FormValues<BuildingTypeDto>, photo: FormPhoto) {
    return await this.saveExisting({
      id: parseNumber(buildingType.id),
      ...this.toDto(buildingType, photo),
    });
  }
}

import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";

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
   * @description Create buildingType
   * @param buildingType - BuildingType
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(buildingType: BuildingType, photo: Photo) {
    // default values
    buildingType.urlName = toSlug(buildingType.name);
    // saving photo
    if (photo) buildingType.image = photo;
  }

  /**
   * @description Update buildingType
   * @param buildingType - BuildingType
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(buildingType: BuildingType, photo: Photo) {
    // default values
    buildingType.urlName = toSlug(buildingType.name);
    // saving photo
    if (photo) buildingType.image = photo;
  }
}

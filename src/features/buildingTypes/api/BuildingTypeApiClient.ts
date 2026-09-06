// base
import { BaseApiClient } from "api/utils";
import { parseNumber } from "api/utils/formToDto";

// types
import { Tables } from "api/types";

// lib
import {
  BuildingTypeAddDto,
  BuildingTypeCommonDto,
  BuildingTypeDto,
  BuildingTypeFilterDto,
  BuildingTypeUpdateDto,
} from "../lib";
import { FormValues } from "lib";

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
   * @returns buildingType dto
   */
  private toDto(buildingType: FormValues<BuildingTypeDto>) {
    return {
      name: buildingType.name ?? "",
    };
  }

  /**
   * @description Create buildingType
   * @param buildingType - BuildingType
   * @returns Transaction status
   */
  async createFromForm(buildingType: FormValues<BuildingTypeDto>) {
    return await this.saveNew(this.toDto(buildingType));
  }

  /**
   * @description Update buildingType
   * @param buildingType - BuildingType
   * @returns Transaction status
   */
  async updateFromForm(buildingType: FormValues<BuildingTypeDto>) {
    return await this.saveExisting({
      id: parseNumber(buildingType.id),
      ...this.toDto(buildingType),
    });
  }
}

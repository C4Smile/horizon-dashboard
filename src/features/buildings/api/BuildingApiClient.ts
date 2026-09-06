
// apis
import { BuildingCostsApiClient } from "./BuildingCostsApiClient.js";
import { BuildingProducesApiClient } from "./BuildingProducesApiClient.js";
import { BuildingReqTechsApiClient } from "./BuildingReqTechsApiClient.js";
import { BuildingUpkeepsApiClient } from "./BuildingUpkeepsApiClient.js";
import { BuildingReqBuildingsApiClient } from "./BuildingReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "api/utils";
import {
  FormPhoto,
  parseHtml,
  parseId,
  parseImage,
  parseNumber,
} from "api/utils/formToDto";

// types
import { Tables } from "api/types";

// lib
import { BuildingAddDto, BuildingCommonDto, BuildingDto, BuildingFilterDto, BuildingUpdateDto } from "../lib";
import { FormValues } from "lib";

/**
 * @class BuildingApiClient
 * @description BuildingApiClient
 */
export class BuildingApiClient extends BaseApiClient<
  BuildingDto,
  BuildingCommonDto,
  BuildingAddDto,
  BuildingUpdateDto,
  BuildingFilterDto
> {
  buildingCosts = new BuildingCostsApiClient();
  buildingUpkeeps = new BuildingUpkeepsApiClient();
  buildingProductions = new BuildingProducesApiClient();
  buildingReqTechs = new BuildingReqTechsApiClient();
  buildingReqBuildings = new BuildingReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super(Tables.Buildings);
  }

  /**
   * @description Maps the form values to what the api stores
   * @param building - form values
   * @param photo - ImageUploader state
   * @returns building dto
   */
  private toDto(building: FormValues<BuildingDto>, photo: FormPhoto) {
    return {
      name: building.name ?? "",
      description: parseHtml(building.description),
      creationTime: parseNumber(building.creationTime),
      typeId: parseId(building.type ?? building.typeId),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create building
   * @param building - Building
   * @param photo - Photo
   * @returns Transaction status
   */
  async createFromForm(building: FormValues<BuildingDto>, photo: FormPhoto) {
    return await this.saveNew(this.toDto(building, photo));
  }

  /**
   * @description Update building
   * @param building - Building
   * @param photo - Photo
   * @returns Transaction status
   */
  async updateFromForm(building: FormValues<BuildingDto>, photo: FormPhoto) {
    return await this.saveExisting({
      id: parseNumber(building.id),
      ...this.toDto(building, photo),
    });
  }
}

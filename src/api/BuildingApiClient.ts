import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local.js";

// config
import config from "../config.js";

// services
import { makeRequest } from "./utils/services";

// apis
import { BuildingCostsApiClient } from "./BuildingCostsApiClient.js";
import { BuildingProducesApiClient } from "./BuildingProducesApiClient.js";
import { BuildingReqTechsApiClient } from "./BuildingReqTechsApiClient.js";
import { BuildingUpkeepsApiClient } from "./BuildingUpkeepsApiClient.js";
import { BuildingReqBuildingsApiClient } from "./BuildingReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient.js";

// lib
import {
  BuildingAddDto,
  BuildingDto,
  BuildingUpdateDto,
  BuildingCommonDto,
  BuildingFilterDto,
} from "lib";
import { Tables } from "./types/dbUtils.js";

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
   * @description Create building
   * @param building - Building
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(building: Building, photo: Photo) {
    // default values
    building.urlName = toSlug(building.name);
    // parsing html
    building.description = draftToHtml(
      convertToRaw(building.description.getCurrentContent())
    );
    // saving photo
    if (photo) building.image = photo;
  }

  /**
   * @description Update building
   * @param building - Building
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(building: Building, photo: Photo) {
    // default values
    building.urlName = toSlug(building.name);
    // parsing html
    building.description = draftToHtml(
      convertToRaw(building.description.getCurrentContent())
    );
    // saving photo
    if (photo) building.image = photo;
  }
}

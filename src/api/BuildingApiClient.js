import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { BuildingCostsApiClient } from "./BuildingCostsApiClient.js";
import { BuildingProducesApiClient } from "./BuildingProducesApiClient.js";
import { BuildingReqTechsApiClient } from "./BuildingReqTechsApiClient.js";
import { BuildingUpkeepsApiClient } from "./BuildingUpkeepsApiClient.js";
import { BuildingReqBuildingsApiClient } from "./BuildingReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// types
import { Building } from "../models/building/Building.js";
import { Photo } from "../models/photo/Photo.js";

/**
 * @class BuildingApiClient
 * @description BuildingApiClient
 */
export class BuildingApiClient extends BaseApiClient {
  buildingCosts = new BuildingCostsApiClient();
  buildingUpkeeps = new BuildingUpkeepsApiClient();
  buildingProductions = new BuildingProducesApiClient();
  buildingReqTechs = new BuildingReqTechsApiClient();
  buildingReqBuildings = new BuildingReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "buildings";
  }

  /**
   * @description Create building
   * @param {Building} building - Building
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async create(building, photo) {
    // default values
    building.urlName = toSlug(building.name);
    // parsing html
    building.description = draftToHtml(convertToRaw(building.description.getCurrentContent()));
    // saving photo
    if (photo) building.image = photo;
    // call service
    const { error, data, status } = await makeRequest("buildings", "POST", building, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update building
   * @param {Building} building - Building
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async update(building, photo) {
    // default values
    building.urlName = toSlug(building.name);
    // parsing html
    building.description = draftToHtml(convertToRaw(building.description.getCurrentContent()));
    // saving photo
    if (photo) building.image = photo;
    // call service
    const { status, error } = await makeRequest(
      `buildings/${building.id}`,
      "PATCH",
      {
        ...building,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }
}

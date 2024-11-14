import { toSlug } from "some-javascript-utils";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// type
import { BuildingType } from "../models/buildingType/BuildingType.js";

/**
 * @class BuildingTypeApiClient
 * @description BuildingTypeApiClient
 */
export class BuildingTypeApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "buildingTypes";
  }

  /**
   * @description Create buildingType
   * @param {BuildingType} buildingType - BuildingType
   * @param {object} photo - Photo
   * @returns Transaction status
   */
  async create(buildingType, photo) {
    // default values
    buildingType.urlName = toSlug(buildingType.name);
    // saving photo
    if (photo) buildingType.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("buildingTypes", "POST", buildingType, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update buildingType
   * @param {BuildingType} buildingType - BuildingType
   * @param {object} photo - Photo
   * @returns Transaction status
   */
  async update(buildingType, photo) {
    // default values
    buildingType.urlName = toSlug(buildingType.name);
    // saving photo
    if (photo) buildingType.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `buildingTypes/${buildingType.id}`,
      "PATCH",
      {
        ...buildingType,
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

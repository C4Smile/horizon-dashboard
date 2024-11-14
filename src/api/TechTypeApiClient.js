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
import { TechType } from "../models/techType/TechType.js";

/**
 * @class TechTypeApiClient
 * @description TechTypeApiClient
 */
export class TechTypeApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "techTypes";
  }

  /**
   * @description Create techType
   * @param {TechType} techType - TechType
   * @param {object} photo - Photo
   * @returns Transaction status
   */
  async create(techType, photo) {
    // default values
    techType.urlName = toSlug(techType.name);
    // saving photo
    if (photo) techType.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("techTypes", "POST", techType, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update techType
   * @param {TechType} techType - TechType
   * @param {object} photo - Photo
   * @returns Transaction status
   */
  async update(techType, photo) {
    // default values
    techType.urlName = toSlug(techType.name);
    // saving photo
    if (photo) techType.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `techTypes/${techType.id}`,
      "PATCH",
      {
        ...techType,
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

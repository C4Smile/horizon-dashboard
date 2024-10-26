// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesBuildingApiClient
 * @description ImagesBuildingApiClient
 */
export class ImagesBuildingApiClient {
  /**
   * @description Create imagesBuilding
   * @param {object} imagesBuilding - ImagesBuilding
   * @returns  Transaction status
   */
  async create(imagesBuilding) {
    // call service
    const { error, data, status } = await makeRequest("buildingHasImage", "POST", imagesBuilding, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    await makeRequest(`buildingHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

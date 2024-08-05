// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesEventsApiClient
 * @description ImagesEventsApiClient
 */
export class ImagesEventsApiClient {
  /**
   * @description Create imagesEvents
   * @param {object} imagesEvents - ImagesEvents
   * @returns  Transaction status
   */
  async create(imagesEvents) {
    // call service
    const { error, data, status } = await makeRequest("eventHasImage", "POST", imagesEvents, {
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
    await makeRequest(`eventHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

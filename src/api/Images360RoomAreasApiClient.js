// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class Images360RoomAreasApiClient
 * @description Images360RoomAreasApiClient
 */
export class Images360RoomAreasApiClient {
  /**
   * @description Create images360Rooms
   * @param {object} images360Rooms - Images360Rooms
   * @returns  Transaction status
   */
  async create(images360Rooms) {
    // call service
    const { error, data, status } = await makeRequest("roomAreaHasImage360", "POST", images360Rooms, {
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
    await makeRequest(`roomAreaHasImage360`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

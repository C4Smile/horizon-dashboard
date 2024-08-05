// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesRoomsApiClient
 * @description ImagesRoomsApiClient
 */
export class ImagesRoomsApiClient {
  /**
   * @description Create roomHasImage
   * @param {object} roomHasImage - ImagesRooms
   * @returns  Transaction status
   */
  async create(roomHasImage) {
    // call service
    const { error, data, status } = await makeRequest("roomHasImage", "POST", roomHasImage, {
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
    await makeRequest(`roomHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

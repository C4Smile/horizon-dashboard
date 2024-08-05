// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesRoomAreasApiClient
 * @description ImagesRoomAreasApiClient
 */
export class ImagesRoomAreasApiClient {
  /**
   * @description Create roomAreaHasImage
   * @param {object} roomAreaHasImage - ImagesRoomAreas
   * @returns  Transaction status
   */
  async create(roomAreaHasImage) {
    // call service
    const { error, data, status } = await makeRequest("roomAreaHasImage", "POST", roomAreaHasImage, {
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
    await makeRequest(`roomAreaHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

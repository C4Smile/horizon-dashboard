// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class Images360RoomsApiClient
 * @description Images360RoomsApiClient
 */
export class Images360RoomsApiClient {
  /**
   * @description Create images360RoomAreas
   * @param {object} images360RoomAreas - Images360RoomAreas
   * @returns  Transaction status
   */
  async create(images360RoomAreas) {
    // call service
    const { error, data, status } = await makeRequest(
      "roomAreaHasImage360",
      "POST",
      images360RoomAreas,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
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

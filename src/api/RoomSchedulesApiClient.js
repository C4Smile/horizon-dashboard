// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoomSchedulesApiClient
 * @description RoomSchedulesApiClient
 */
export class RoomSchedulesApiClient {
  /**
   * @description Create roomSchedules
   * @param {object} roomSchedules - RoomSchedules
   * @returns  Transaction status
   */
  async create(roomSchedules) {
    // call service
    const { error, data, status } = await makeRequest("roomHasSchedules", "POST", roomSchedules, {
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
    for (const id of ids)
      await makeRequest(`roomHasSchedules/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

    return { status: 204 };
  }

  /**
   * @description Delete roomSchedules
   * @param {number} id - RoomSchedules id
   * @returns Transaction status
   */
  async deleteSingle(id) {
    await makeRequest(`roomHasSchedules/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class RoomStatusApiClient
 * @description RoomStatusApiClient
 */
export class RoomStatusApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "roomStatus";
  }

  /**
   * @description Create roomStatus
   * @param {object} roomStatus - RoomStatus
   * @returns {Promise<any>} RoomStatus
   */
  async create(roomStatus) {
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", roomStatus, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update roomStatus
   * @param {object} roomStatus - RoomStatus
   * @returns {Promise<any>} RoomStatus
   */
  async update(roomStatus) {
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${roomStatus.id}`,
      "PATCH",
      {
        ...roomStatus,
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

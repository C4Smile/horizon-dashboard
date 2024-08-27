import { RoomType } from "../models/roomType/RoomType";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoomTypeApiClient
 * @description RoomTypeApiClient
 */
export class RoomTypeApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "roomType";
  }

  /**
   * @description Create roomType
   * @param {RoomType} roomType - RoomType
   * @param {object} photo - RoomType photo
   * @returns {Promise<RoomType>} RoomType
   */
  async create(roomType, photo) {
    // saving image
    if (photo) roomType.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", roomType, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update roomType
   * @param {RoomType} roomType - RoomType
   * @param {object} photo - Photo to keep
   * @returns {Promise<RoomType>} RoomType
   */
  async update(roomType, photo) {
    // saving photo
    if (photo) roomType.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${roomType.id}`,
      "PATCH",
      {
        ...roomType,
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

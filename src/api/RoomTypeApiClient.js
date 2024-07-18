import { RoomType } from "../models/roomType/RoomType";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoomTypeApiClient
 * @description RoomTypeApiClient
 */
export class RoomTypeApiClient {
  /**
   * @description Get all roomType
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns {Promise<RoomType[]>} RoomType
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`roomType?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get roomType by id
   * @param {string} id - RoomType id
   * @returns {Promise<RoomType>} RoomType
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`roomType/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Get roomType by id
   * @param {string} entity - RoomType id
   * @returns {Promise<RoomType>} some entity
   */
  async getEntity(entity) {
    const { data, error, status } = await makeRequest(`${entity}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
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
    const { error, data, status } = await makeRequest("roomType", "POST", roomType, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, data, statusCode: status, message: error.message };

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
      `roomType/${roomType.id}`,
      "PUT",
      {
        ...roomType,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`roomType/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

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
   * @description Get all images360Rooms
   * @returns Images360Rooms list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("images360Rooms");
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get images360Rooms by id
   * @param {string} id - Images360Rooms id
   * @returns Images360Rooms by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`images360Rooms/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create images360Rooms
   * @param {object} images360Rooms - Images360Rooms
   * @returns  Transaction status
   */
  async create(images360Rooms) {
    // call service
    const { error, data, status } = await makeRequest("images360Rooms", "POST", images360Rooms, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update images360Rooms
   * @param {object} images360Rooms - Images360Rooms
   * @returns Transaction status
   */
  async update(images360Rooms) {
    // call service
    const { status, error } = await makeRequest(
      `images360Rooms/${images360Rooms.id}`,
      "PUT",
      images360Rooms,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`images360Rooms/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

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
   * @description Get all imagesRooms
   * @returns ImagesRooms list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("imagesRooms");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get imagesRooms by id
   * @param {string} id - ImagesRooms id
   * @returns ImagesRooms by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`imagesRooms/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create imagesRooms
   * @param {object} imagesRooms - ImagesRooms
   * @returns  Transaction status
   */
  async create(imagesRooms) {
    // call service
    const { error, data, status } = await makeRequest("imagesRooms", "POST", imagesRooms, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update imagesRooms
   * @param {object} imagesRooms - ImagesRooms
   * @returns Transaction status
   */
  async update(imagesRooms) {
    // call service
    const { status, error } = await makeRequest(`imagesRooms/${imagesRooms.id}`, "PUT", imagesRooms, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
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
      await makeRequest(`imagesRooms/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

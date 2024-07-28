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
   * @description Get all roomHasImage
   * @returns ImagesRooms list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("roomHasImage");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get roomHasImage by id
   * @param {string} id - ImagesRooms id
   * @returns ImagesRooms by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`roomHasImage/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

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
   * @description Update roomHasImage
   * @param {object} roomHasImage - ImagesRooms
   * @returns Transaction status
   */
  async update(roomHasImage) {
    // call service
    const { status, error } = await makeRequest(
      `roomHasImage/${roomHasImage.id}`,
      "PATCH",
      roomHasImage,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`roomHasImage/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

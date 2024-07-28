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
   * @description Get all roomAreaHasImage
   * @returns ImagesRoomAreas list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("roomAreaHasImage");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get roomAreaHasImage by id
   * @param {string} id - ImagesRoomAreas id
   * @returns ImagesRoomAreas by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`roomAreaHasImage/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

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
   * @description Update roomAreaHasImage
   * @param {object} roomAreaHasImage - ImagesRoomAreas
   * @returns Transaction status
   */
  async update(roomAreaHasImage) {
    // call service
    const { status, error } = await makeRequest(
      `roomAreaHasImage/${roomAreaHasImage.id}`,
      "PATCH",
      roomAreaHasImage,
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
      await makeRequest(`roomAreaHasImage/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

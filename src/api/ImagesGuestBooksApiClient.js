// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesGuestBooksApiClient
 * @description ImagesGuestBooksApiClient
 */
export class ImagesGuestBooksApiClient {
  /**
   * @description Get all guestBookHasImage
   * @returns ImagesGuestBooks list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("guestBookHasImage");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get guestBookHasImage by id
   * @param {string} id - ImagesGuestBooks id
   * @returns ImagesGuestBooks by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`guestBookHasImage/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create guestBookHasImage
   * @param {object} guestBookHasImage - ImagesGuestBooks
   * @returns  Transaction status
   */
  async create(guestBookHasImage) {
    // call service
    const { error, data, status } = await makeRequest("guestBookHasImage", "POST", guestBookHasImage, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update guestBookHasImage
   * @param {object} guestBookHasImage - ImagesGuestBooks
   * @returns Transaction status
   */
  async update(guestBookHasImage) {
    // call service
    const { status, error } = await makeRequest(
      `guestBookHasImage/${guestBookHasImage.id}`,
      "PATCH",
      guestBookHasImage,
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
      await makeRequest(`guestBookHasImage/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

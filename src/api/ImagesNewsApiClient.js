// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesNewsApiClient
 * @description ImagesNewsApiClient
 */
export class ImagesNewsApiClient {
  /**
   * @description Create imagesNews
   * @param {object} imagesNews - ImagesNews
   * @returns  Transaction status
   */
  async create(imagesNews) {
    // call service
    const { error, data, status } = await makeRequest("newsHasImage", "POST", imagesNews, {
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
    await makeRequest(`newsHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

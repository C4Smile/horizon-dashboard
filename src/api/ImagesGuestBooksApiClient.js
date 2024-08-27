// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesGuestBookApiClient
 * @description ImagesGuestBookApiClient
 */
export class ImagesGuestBooksApiClient {
  /**
   * @description Create imagesGuestBook
   * @param {object} imagesGuestBook - ImagesGuestBook
   * @returns  Transaction status
   */
  async create(imagesGuestBook) {
    // call service
    const { error, data, status } = await makeRequest("guestBookHasImage", "POST", imagesGuestBook, {
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
    await makeRequest(`guestBookHasImage`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class Images360GuestBooksApiClient
 * @description Images360GuestBooksApiClient
 */
export class Images360GuestBooksApiClient {
  /**
   * @description Create images360GuestBooks
   * @param {object} images360GuestBooks - Images360GuestBooks
   * @returns  Transaction status
   */
  async create(images360GuestBooks) {
    // call service
    const { error, data, status } = await makeRequest(
      "guestBookHasImage360",
      "POST",
      images360GuestBooks,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`guestBookHasImage360/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

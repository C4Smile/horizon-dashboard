// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TagsNewsApiClient
 * @description TagsNewsApiClient
 */
export class TagsNewsApiClient {
  /**
   * @description Create tagsNews
   * @param {object} tagsNews - TagsNews
   * @returns  Transaction status
   */
  async create(tagsNews) {
    // call service
    const { error, data, status } = await makeRequest("newsHasTag", "POST", tagsNews, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a tagsNews by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async delete(tagId, newsId) {
    await makeRequest(
      `newsHasTag`,
      "DELETE",
      { tagId, newsId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

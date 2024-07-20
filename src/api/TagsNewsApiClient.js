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
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`newsHasTag/${id}`, "DELETE");
    }
    return { status: 204 };
  }

  /**
   * @description Get a tagsNews by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async deleteByNews(tagId, newsId) {
    await makeRequest(`news/${newsId}/tags/${tagId}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

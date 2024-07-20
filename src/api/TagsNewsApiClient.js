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
   * @description Get all tagsNews
   * @returns TagsNews list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("tagsNews");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get tagsNews by id
   * @param {string} id - TagsNews id
   * @returns TagsNews by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`tagsNews/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create tagsNews
   * @param {object} tagsNews - TagsNews
   * @returns  Transaction status
   */
  async create(tagsNews) {
    // call service
    const { error, data, status } = await makeRequest("tagsNews", "POST", tagsNews, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tagsNews
   * @param {object} tagsNews - TagsNews
   * @returns Transaction status
   */
  async update(tagsNews) {
    // call service
    const { status, error } = await makeRequest(`tagsNews/${tagsNews.id}`, "PUT", tagsNews, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error : { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`tagsNews/${id}`, "DELETE");
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
    await makeRequest(`tagsNews/${tagId}/news/${newsId}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

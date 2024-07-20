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
   * @description Get all imagesNews
   * @returns ImagesNews list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("imagesNews");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get imagesNews by id
   * @param {string} id - ImagesNews id
   * @returns ImagesNews by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`imagesNews/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create imagesNews
   * @param {object} imagesNews - ImagesNews
   * @returns  Transaction status
   */
  async create(imagesNews) {
    // call service
    const { error, data, status } = await makeRequest("imagesNews", "POST", imagesNews, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update imagesNews
   * @param {object} imagesNews - ImagesNews
   * @returns Transaction status
   */
  async update(imagesNews) {
    // call service
    const { status, error } = await makeRequest(`imagesNews/${imagesNews.id}`, "PUT", imagesNews, {
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
      await makeRequest(`imagesNews/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

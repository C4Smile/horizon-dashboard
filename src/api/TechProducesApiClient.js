// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TechProducesApiClient
 * @description TechProducesApiClient
 */
export class TechProducesApiClient {
  /**
   * @param {number} techId id of the tech
   * @returns tech produces
   */
  async get(techId) {
    // call service
    const { error, data, status } = await makeRequest(`techProduces/${techId}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, items: data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create techProduces
   * @param {number} techId tech to save
   * @param {object} techProduces - TechProduces
   * @returns  Transaction status
   */
  async create(techId, techProduces) {
    // call service
    const { error, data, status } = await makeRequest(`techProduces/${techId}`, "POST", techProduces, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a techProduces by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async delete(tagId, newsId) {
    await makeRequest(
      `techProduces`,
      "DELETE",
      { tagId, newsId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

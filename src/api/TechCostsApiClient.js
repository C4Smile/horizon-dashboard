// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TechCostsApiClient
 * @description TechCostsApiClient
 */
export class TechCostsApiClient {
  /**
   * @param {number} techId id of the tech
   * @returns tech costs
   */
  async get(techId) {
    // call service
    const { error, data, status } = await makeRequest(`techCosts/${techId}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, items: data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create techCosts
   * @param {number} techId tech to save
   * @param {object} techCosts - TechCosts
   * @returns  Transaction status
   */
  async create(techId, techCosts) {
    // call service
    const { error, data, status } = await makeRequest(`techCosts/${techId}`, "POST", techCosts, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a techCosts by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async delete(tagId, newsId) {
    await makeRequest(
      `techCosts`,
      "DELETE",
      { tagId, newsId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TechReqTechsApiClient
 * @description TechReqTechsApiClient
 */
export class TechReqTechsApiClient {
  /**
   * @param {number} techId id of the tech
   * @returns tech requirements
   */
  async get(techId) {
    // call service
    const { error, data, status } = await makeRequest(`techReqTechs/${techId}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, items: data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create techReqTechs
   * @param {number} techId tech to save
   * @param {object} techReqTechs - TechReqTechs
   * @returns  Transaction status
   */
  async create(techId, techReqTechs) {
    // call service
    const { error, data, status } = await makeRequest(`techReqTechs/${techId}`, "POST", techReqTechs, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a techReqTechs by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async delete(tagId, newsId) {
    await makeRequest(
      `techReqTechs`,
      "DELETE",
      { tagId, newsId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

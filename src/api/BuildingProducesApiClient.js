// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class BuildingProducesApiClient
 * @description BuildingProducesApiClient
 */
export class BuildingProducesApiClient {
  /**
   * @description Create buildingProduces
   * @param {object} buildingProduces - BuildingProduces
   * @returns  Transaction status
   */
  async create(buildingProduces) {
    // call service
    const { error, data, status } = await makeRequest("buildingProduce", "POST", buildingProduces, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a buildingProduces by newsId
   * @param {number} tagId - Tag id
   * @param {number} newsId - News id
   * @returns Status
   */
  async delete(tagId, newsId) {
    await makeRequest(
      `buildingProduce`,
      "DELETE",
      { tagId, newsId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

// services
import { makeRequest } from "../../db/services";

// utils
import { fromLocal } from "../../utils/local";

// config
import config from "../../config";

/**
 * @class BaseManyApiClient
 * @description BaseManyApiClient
 */
export class BaseManyApiClient {
  baseUrl = "";
  idAttribute = "";
  idsAttribute = "";

  /**
   *
   * @param {string} baseUrl string url
   * @param {string} idAttribute id url
   * @param {string} idsAttribute ids url
   */
  constructor(baseUrl, idAttribute, idsAttribute) {
    this.baseUrl = baseUrl;
    this.idAttribute = idAttribute;
    this.idsAttribute = idsAttribute;
  }

  /**
   * @param {number} entityId id of the entity
   * @returns many relationships
   */
  async get(entityId) {
    // call service
    const { error, data, status } = await makeRequest(`${this.baseUrl}/${entityId}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, items: data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create techCosts
   * @param {number} entityId tech to save
   * @param {object} object - BaseMany
   * @returns Transaction status
   */
  async save(entityId, object) {
    // call service
    const { error, data, status } = await makeRequest(
      `${this.baseUrl}/${entityId}`,
      object.id ? "PATCH" : "POST",
      object,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a techCosts by newsId
   * @param {number} entityId - Tag id
   * @param {number[]} list - News id
   * @returns Status
   */
  async delete(entityId, list) {
    await makeRequest(`${this.baseUrl}/${entityId}`, "DELETE", list, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }

  /**
   * @description Get a techCosts by newsId
   * @param {number} entityId - Entity id
   * @param {number} remoteId - Remote id
   * @returns Status
   */
  async deleteSingle(entityId, remoteId) {
    await makeRequest(`${this.baseUrl}/${entityId}/${remoteId}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

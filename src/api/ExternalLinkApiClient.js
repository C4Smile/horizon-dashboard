// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ExternalLinkApiClient
 * @description ExternalLinkApiClient
 */
export class ExternalLinkApiClient {
  /**
   * @description Get all externalLink
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns {Promise<any[]>} ExternalLink
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`externalLink?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get externalLink by id
   * @param {string} id - ExternalLink id
   * @returns {Promise<any[]>} ExternalLink
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`externalLink/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Get externalLink by id
   * @param {string} entity - ExternalLink id
   * @returns {Promise<any[]>} some entity
   */
  async getEntity(entity) {
    const { data, error, status } = await makeRequest(`${entity}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Create externalLink
   * @param {object} externalLink - ExternalLink
   * @returns {Promise<any[]>} ExternalLink
   */
  async create(externalLink) {
    // call service
    const { error, data, status } = await makeRequest("externalLink", "POST", externalLink, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, data, statusCode: status, message: error.message };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update externalLink
   * @param {object} externalLink - ExternalLink
   * @returns {Promise<any[]>} ExternalLink
   */
  async update(externalLink) {
    // call service
    const { status, error } = await makeRequest(
      `externalLink/${externalLink.id}`,
      "PUT",
      {
        ...externalLink,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`externalLink/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

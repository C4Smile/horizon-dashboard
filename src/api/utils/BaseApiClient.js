// services
import { makeRequest } from "../../db/services";

// utils
import { SortOrder } from "../../models/query/GenericFilter";
import { fromLocal } from "../../utils/local";

// config
import config from "../../config";

/**
 * @class BaseApiClient
 * @description it has all base method
 */
export class BaseApiClient {
  baseUrl = "";

  /**
   * @description Get all objects
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns {Promise<object[]>} Result list
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`${this.baseUrl}?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get entity by id
   * @param {string} id - object id
   * @returns {Promise<object>} object
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`${this.baseUrl}/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    const { data, status, error } = await makeRequest(`${this.baseUrl}`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, error, status: status === 200 ? 204 : status };
  }

  /**
   * Restore elements by their id
   * @param {number[]} ids to restore
   * @returns Transaction status
   */
  async restore(ids) {
    const { data, status, error } = await makeRequest(`${this.baseUrl}/restore`, "PATCH", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, error, status: status === 200 ? 204 : status };
  }
}

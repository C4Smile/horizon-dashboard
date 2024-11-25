// services
import { makeRequest } from "../../db/services";

// utils
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
   * @param userId user locker
   * @param entityId entity id to lock
   * @returns {Promise<{error: {message: string}, status: number}|any>} result of http
   */
  async lock(userId, entityId) {
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}/${entityId}/lock`,
      "PATCH",
      {
        userId,
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @param entityId entity id to lock
   * @returns {Promise<{error: {message: string}, status: number}|any>} result of http
   */
  async release(entityId) {
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}/${entityId}/release`,
      "PATCH",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get all objects
   * @param {object} query - query parameters
   * @returns {Promise<object[]> | object} Result list
   */
  async getAll(query = { sortingBy: "id", sortingOrder: "asc", currentPage: 0, pageSize: 50 }) {
    const { sortingBy, sortingOrder, currentPage, pageSize } = query;
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}?sort=${sortingBy}&order=${sortingOrder}&page=${currentPage}&count=${pageSize}`,
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get entity by id
   * @param {string} id - object id
   * @returns {Promise<object>} object
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`${this.baseUrl}/${id}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
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

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoleApiClient
 * @description RoleApiClient
 */
export class RoleApiClient {
  /**
   * @description Get all roles
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<any[]>} Role
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`role?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get role by id
   * @param {string} id - Role id
   * @returns {Promise<any>} Role
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`role/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create role
   * @param {object} role - Role
   * @returns {Promise<any>} Role
   */
  async create(role) {
    // call service
    const { error, data, status } = await makeRequest("role", "POST", role, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update role
   * @param {any} role - Role
   * @returns {Promise<any>} Role
   */
  async update(role) {
    // call service
    const { status, error } = await makeRequest(
      `role/${role.id}`,
      "PUT",
      {
        ...role,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error : { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`role/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

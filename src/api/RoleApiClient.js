// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class RoleApiClient
 * @description RoleApiClient
 */
export class RoleApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "museumRole";
  }

  /**
   * @description Create role
   * @param {object} role - Role
   * @returns {Promise<any>} Role
   */
  async create(role) {
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", role, {
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
      `${this.baseUrl}/${role.id}`,
      "PATCH",
      {
        ...role,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }
}

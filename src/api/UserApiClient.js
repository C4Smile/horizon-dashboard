// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal, toLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class UserApiClient
 * @description UserApiClient
 */
export class UserApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "horizonUser";
  }

  /**
   * Logs an user
   * @param {string} user - username
   * @param {string} password - password
   * @returns Transaction result
   */
  async login(user, password) {
    const { data, error } = await makeRequest(`auth/login`, "POST", {
      username: user,
      password,
    });
    if (data && data.user) {
      data.user.email = user;
      toLocal(config.user, data);
    }
    return {
      json: async () => ({ ...data, status: error ? error.status : 200, error }),
    };
  }

  /**
   * Fetch owner data
   * @param {string} userId - User id
   * @returns Owner
   */
  async fetchOwner(userId) {
    const { data, error } = await makeRequest(`horizonUser/byUserId/${userId}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return {
      json: async () => ({ ...data, status: error ? error.status : 200, error }),
    };
  }

  /**
   * Get session
   * @returns the current session
   */
  async getSession() {
    const { data, error, status } = await makeRequest(`auth/validate`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, status: error?.status ?? status, error };
  }

  /**
   * Validates a token
   * @returns refreshed token
   */
  async validates() {
    const { data, error, status } = await makeRequest(`auth/validate`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, status: error?.status ?? status, error };
  }

  /**
   * Logouts an user
   * @returns Transaction result
   */
  async logout() {
    // await supabase.auth.signOut();
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @param {object} photo - User photo
   * @returns  Transaction status
   */
  async create(user, photo) {
    // deleting rPassword
    delete user.rPassword;
    // saving image
    if (photo) user.imageId = photo.id;

    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", user, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @param {object} photo - User photo
   * @returns  Transaction status
   */
  async update(user, photo) {
    // deleting rPassword
    delete user.rPassword;
    // saving photo
    if (photo) user.imageId = photo.id;

    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${user.id}`,
      "PATCH",
      {
        ...user,
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

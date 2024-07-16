// utils
import { fromLocal } from "../utils/local";
import { makeRequest } from "../db/services";

import config from "../config";

/**
 * @class UserApiClient
 * @description UserApiClient
 */
export class UserApiClient {
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
    return {
      json: async () => ({ ...data, status: error ? error.status : 200 }),
    };
  }

  /**
   * Fetch owner data
   * @param {string} userId - User id
   * @returns Owner
   */
  async fetchOwner(userId) {
    const { data, error } = await makeRequest(`museumUser/byUserId/${userId}`);
    return {
      json: async () => ({ ...data[0], status: error ? error.status : 200 }),
    };
  }

  /**
   * Get session
   * @returns the current session
   */
  async getSession() {
    const { data, error } = await makeRequest(`auth/validate`, "POST");
    return { data, error };
  }

  /**
   * Validates a token
   * @returns refreshed token
   */
  async validates() {
    const { data, error } = await makeRequest(`auth/validate`, "POST");
    return { data, status: error?.status };
  }

  /**
   * Logouts an user
   * @returns Transaction result
   */
  async logout() {
    // await supabase.auth.signOut();
  }

  // TODO ALL DOWN BELOW

  /**
   * @description Get all countries
   * @returns Province list
   */
  async getAll() {
    const request = await fetch(`user`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return await request.json();
  }

  /**
   * @description Get user by id
   * @param {string} id - Province id
   * @returns Province by id
   */
  async getById(id) {
    const request = await fetch(`user/${id}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return await request.json();
  }

  /**
   * @description Create user
   * @param {object} user - Province
   * @returns  Transaction status
   */
  async create(user) {
    const request = await fetch(`user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update user
   * @param {object} user - Province
   * @returns Transaction status
   */
  async update(user) {
    const request = await fetch(`user/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await fetch(`user/${id}`, {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
        },
      });
    }
    return { status: 204 };
  }
}

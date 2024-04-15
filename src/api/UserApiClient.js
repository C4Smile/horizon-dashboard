// utils
import { fromLocal } from "../utils/local";

import config from "../config";

/**
 * @class UserApiClient
 * @description UserApiClient
 */
export class UserApiClient {
  /**
   * Validates a token
   * @returns refreshed token
   */
  async validates() {
    const request = await fetch(`${config.apiUrl}auth/validate`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * Logs an user
   * @param {string} user - username
   * @param {string} password - password
   * @returns Transaction result
   */
  async login(user, password) {
    const request = await fetch(`${config.apiUrl}auth/login`, {
      method: "POST",
      body: JSON.stringify({ username: user, password }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    return request;
  }

  /**
   * @description Get all countries
   * @returns Province list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}user`, {
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
    const request = await fetch(`${config.apiUrl}user/${id}`, {
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
    const request = await fetch(`${config.apiUrl}user`, {
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
    const request = await fetch(`${config.apiUrl}user/${user.id}`, {
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
      await fetch(`${config.apiUrl}user/${id}`, {
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

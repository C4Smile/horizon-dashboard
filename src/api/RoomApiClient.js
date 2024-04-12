import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class ProvinceApiClient
 * @description ProvinceApiClient
 */
export class ProvinceApiClient {
  /**
   * @description Get all countries
   * @returns Province list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}province`, {
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
   * @description Get province by id
   * @param {string} id - Province id
   * @returns Province by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}province/${id}`, {
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
   * @description Create province
   * @param {object} province - Province
   * @returns  Transaction status
   */
  async create(province) {
    const request = await fetch(`${config.apiUrl}province`, {
      method: "POST",
      body: JSON.stringify(province),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update province
   * @param {object} province - Province
   * @returns Transaction status
   */
  async update(province) {
    const request = await fetch(`${config.apiUrl}province/${province.id}`, {
      method: "PATCH",
      body: JSON.stringify(province),
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
      await fetch(`${config.apiUrl}province/${id}`, {
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

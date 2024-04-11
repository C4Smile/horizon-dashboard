import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class CountryApiClient
 * @description CountryApiClient
 */
export class CountryApiClient {
  /**
   * @description Get all countries
   * @returns Country list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}country`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Get country by id
   * @param {string} id - Country id
   * @returns Country by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}country/${id}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Create country
   * @param {object} country - Country
   * @returns  Transaction status
   */
  async create(country) {
    const request = await fetch(`${config.apiUrl}country`, {
      method: "POST",
      body: JSON.stringify(country),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update country
   * @param {object} country - Country
   * @returns Transaction status
   */
  async update(country) {
    const request = await fetch(`${config.apiUrl}country/${country.id}`, {
      method: "PATCH",
      body: JSON.stringify(country),
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
      await fetch(`${config.apiUrl}country/${id}`, {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
        },
      });
    }
  }
}

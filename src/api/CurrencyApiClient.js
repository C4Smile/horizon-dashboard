import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class CurrencyApiClient
 * @description CurrencyApiClient
 */
export class CurrencyApiClient {
  /**
   * @description Get all currencies
   * @returns Currency list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}currency`, {
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
   * @description Get currency by id
   * @param {string} id - Currency id
   * @returns Currency by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}currency/${id}`, {
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
   * @description Create currency
   * @param {object} currency - Currency
   * @returns  Transaction status
   */
  async create(currency) {
    const request = await fetch(`${config.apiUrl}currency`, {
      method: "POST",
      body: JSON.stringify(currency),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update currency
   * @param {object} currency - Currency
   * @returns Transaction status
   */
  async update(currency) {
    const request = await fetch(`${config.apiUrl}currency/${currency.id}`, {
      method: "PATCH",
      body: JSON.stringify(currency),
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
      await fetch(`${config.apiUrl}currency/${id}`, {
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

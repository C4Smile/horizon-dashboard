import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class NewsApiClient
 * @description NewsApiClient
 */
export class NewsApiClient {
  /**
   * @description Get all news
   * @returns News list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}news`, {
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
   * @description Get news by id
   * @param {string} id - News id
   * @returns News by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}news/${id}`, {
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
   * @description Create news
   * @param {object} news - News
   * @returns  Transaction status
   */
  async create(news) {
    const request = await fetch(`${config.apiUrl}news`, {
      method: "POST",
      body: JSON.stringify(news),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update news
   * @param {object} news - News
   * @returns Transaction status
   */
  async update(news) {
    const request = await fetch(`${config.apiUrl}news/${news.id}`, {
      method: "PATCH",
      body: JSON.stringify(news),
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
      await fetch(`${config.apiUrl}news/${id}`, {
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

import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class TagApiClient
 * @description TagApiClient
 */
export class TagApiClient {
  /**
   * @description Get all Tag
   * @returns Tag list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}tag`, {
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
   * @description Get Tag by id
   * @param {string} id - Tag id
   * @returns Tag by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}tag/${id}`, {
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
   * @description Create Tag
   * @param {object} Tag - Tag
   * @returns  Transaction status
   */
  async create(Tag) {
    const request = await fetch(`${config.apiUrl}tag`, {
      method: "POST",
      body: JSON.stringify(Tag),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update Tag
   * @param {object} Tag - Tag
   * @returns Transaction status
   */
  async update(Tag) {
    const request = await fetch(`${config.apiUrl}tag/${Tag.id}`, {
      method: "PATCH",
      body: JSON.stringify(Tag),
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
      await fetch(`${config.apiUrl}tag/${id}`, {
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

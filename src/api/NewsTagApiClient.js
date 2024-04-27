import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class NewTagApiClient
 * @description NewTagApiClient
 */
export class NewTagApiClient {
  /**
   * @description Get all newTags
   * @returns NewTag list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}newTag`, {
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
   * @description Get newTag by id
   * @param {string} id - NewTag id
   * @returns NewTag by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}newTag/${id}`, {
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
   * @description Create newTag
   * @param {object} newTag - NewTag
   * @returns  Transaction status
   */
  async create(newTag) {
    const request = await fetch(`${config.apiUrl}newTag`, {
      method: "POST",
      body: JSON.stringify(newTag),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update newTag
   * @param {object} newTag - NewTag
   * @returns Transaction status
   */
  async update(newTag) {
    const request = await fetch(`${config.apiUrl}newTag/${newTag.id}`, {
      method: "PATCH",
      body: JSON.stringify(newTag),
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
      await fetch(`${config.apiUrl}newTag/${id}`, {
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

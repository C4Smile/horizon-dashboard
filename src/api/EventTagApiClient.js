import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class EventTagsApiClient
 * @description EventTagsApiClient
 */
export class EventTagsApiClient {
  /**
   * @description Get all eventTags
   * @returns EventTags list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}eventTag`, {
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
   * @description Get eventTag by id
   * @param {string} id - EventTags id
   * @returns EventTags by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}eventTag/${id}`, {
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
   * @description Create eventTag
   * @param {object} eventTag - EventTags
   * @returns  Transaction status
   */
  async create(eventTag) {
    const request = await fetch(`${config.apiUrl}eventTag`, {
      method: "POST",
      body: JSON.stringify(eventTag),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update eventTag
   * @param {object} eventTag - EventTags
   * @returns Transaction status
   */
  async update(eventTag) {
    const request = await fetch(`${config.apiUrl}eventTag/${eventTag.id}`, {
      method: "PATCH",
      body: JSON.stringify(eventTag),
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
      await fetch(`${config.apiUrl}eventTag/${id}`, {
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

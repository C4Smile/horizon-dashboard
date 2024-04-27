import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class EventApiClient
 * @description EventApiClient
 */
export class EventApiClient {
  /**
   * @description Get all events
   * @returns Event list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}event`, {
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
   * @description Get event by id
   * @param {string} id - Event id
   * @returns Event by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}event/${id}`, {
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
   * @description Create event
   * @param {object} event - Event
   * @returns  Transaction status
   */
  async create(event) {
    const request = await fetch(`${config.apiUrl}event`, {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update event
   * @param {object} event - Event
   * @returns Transaction status
   */
  async update(event) {
    const request = await fetch(`${config.apiUrl}event/${event.id}`, {
      method: "PATCH",
      body: JSON.stringify(event),
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
      await fetch(`${config.apiUrl}event/${id}`, {
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

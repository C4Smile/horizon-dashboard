import config from "../config";

// utils
import { fromLocal } from "../utils/local";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  /**
   * @description Get all countries
   * @returns Room list
   */
  async getAll() {
    const request = await fetch(`${config.apiUrl}room`, {
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
   * @description Get room by id
   * @param {string} id - Room id
   * @returns Room by id
   */
  async getById(id) {
    const request = await fetch(`${config.apiUrl}room/${id}`, {
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
   * @description Create room
   * @param {object} room - Room
   * @returns  Transaction status
   */
  async create(room) {
    const request = await fetch(`${config.apiUrl}room`, {
      method: "POST",
      body: JSON.stringify(room),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    });
    return request;
  }

  /**
   * @description Update room
   * @param {object} room - Room
   * @returns Transaction status
   */
  async update(room) {
    const request = await fetch(`${config.apiUrl}room/${room.id}`, {
      method: "PATCH",
      body: JSON.stringify(room),
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
      await fetch(`${config.apiUrl}room/${id}`, {
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

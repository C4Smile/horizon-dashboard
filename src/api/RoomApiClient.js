import config from "../config";
import { fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";
import { fromLocal } from "../utils/local";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  /**
   * @description Get all rooms
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
    return request;
  }

  /**
   * @description Get room by
   * @param {string} id - Room id
   * @param {string} attributes - Attributes
   * @returns Room by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("room", id, attributes);
  }

  /**
   * @description Create room
   * @param {object} room - Room
   * @returns  Transaction status
   */
  async create(room) {
    return await saveToLocal("room", room);
  }

  /**
   * @description Update room
   * @param {object} room - Room
   * @returns Transaction status
   */
  async update(room) {
    return await saveToLocal("room", room);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("room", ids);
  }
}

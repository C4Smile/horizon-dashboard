import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  /**
   * @description Get all rooms
   * @param {string} attributes - Attributes
   * @returns Room list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("room", attributes);
  }

  /**
   * @description Get room by id
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

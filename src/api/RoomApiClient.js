import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  /**
   * @description Get all users
   * @param {string} attributes - Attributes
   * @returns Room list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("room", attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @returns Room by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("room", id, attributes);
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @returns  Transaction status
   */
  async create(user) {
    return await saveToLocal("room", user);
  }

  /**
   * @description Update user
   * @param {object} user - User
   * @returns Transaction status
   */
  async update(user) {
    return await saveToLocal("room", user);
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

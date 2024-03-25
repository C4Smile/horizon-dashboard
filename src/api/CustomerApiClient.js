import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class CustomerApiClient
 * @description CustomerApiClient
 */
export class CustomerApiClient {
  /**
   * @description Get all users
   * @param {string} attributes - Attributes
   * @returns Customer list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("customer", attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @returns Customer by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("customer", id, attributes);
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @returns  Transaction status
   */
  async create(user) {
    return await saveToLocal("customer", user);
  }

  /**
   * @description Update user
   * @param {object} user - User
   * @returns Transaction status
   */
  async update(user) {
    return await saveToLocal("customer", user);
  }

  /**
   * Remove elements by their id
   * @param {int[]} ids
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("customer", ids);
  }
}

import { fetchFromLocal, fetchSingleFromLocal, saveToLocal } from "../db/connection";

/**
 * @class CustomerApiClient
 * @description CustomerApiClient
 */
export class CustomerApiClient {
  /**
   * @description Get all users
   * @param {string} attributes - Attributes
   * @returns Users list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("customer", attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @returns User
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("customer", id, attributes);
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @returns User
   */
  async create(user) {
    return await saveToLocal("customer", user);
  }

  /**
   * @description Update user
   * @param {object} user - User
   * @returns User
   */
  async update(user) {
    return await saveToLocal("customer", user);
  }
}

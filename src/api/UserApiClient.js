import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class UserApiClient
 * @description UserApiClient
 */
export class UserApiClient {
  /**
   * Logs an user
   * @param {string} user - username
   * @param {string} password - password
   * @returns Transaction result
   */
  async login(user, password) {
    const result = await saveToLocal("user_account", { id: 1, user });
    result.data = { id: 1, user };
    return result;
  }

  /**
   * Logouts an user
   * @param {string} user - username
   * @returns Transaction result
   */
  async logout(user) {
    return await deleteFromLocal("user_account", user);
  }

  /**
   * @description Get all users
   * @param {string} attributes - Attributes
   * @returns User list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("user", attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @param {string[]} exclude - attributes to exclude
   * @returns User by id
   */
  async getById(id, attributes = "*", exclude = []) {
    const result = await fetchSingleFromLocal("user", id, attributes);
    if (exclude.length)
      exclude.forEach((attribute) => {
        delete result.data[attribute];
      });
    return result;
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @returns  Transaction status
   */
  async create(user) {
    return await saveToLocal("user", user);
  }

  /**
   * @description Update user
   * @param {object} user - User
   * @returns Transaction status
   */
  async update(user) {
    return await saveToLocal("user", user);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("user", ids);
  }
}

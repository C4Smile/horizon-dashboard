// db
import supabase from "../db/connection";

/**
 * @class CustomerApiClient
 * @description CustomerApiClient
 */
export class CustomerApiClient {
  /**
   * @description Get all users
   * @param {string} query - Query
   * @returns {Promise<User[]>} Users
   */
  async getAll(attributes = "*") {
    return await supabase.from("Customer").select(attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @returns {Promise<User>} User
   */
  async getById(id, attributes = "*") {
    return await supabase.from("Customer").select(attributes).eq("id", id);
  }

  /**
   * @description Create user
   * @param {User} user - User
   * @returns {Promise<User>} User
   */
  async create(user) {
    return await supabase.from("Customer").insert(user);
  }

  /**
   * @description Update user
   * @param {User} user - User
   * @returns {Promise<User>} User
   */
  async update(user) {
    return await supabase.from("Customer").update(user).eq("id", user.id);
  }
}

// db
import supabase from "../db/connection";

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
    return await supabase.from("Customer").select(attributes);
  }

  /**
   * @description Get user by id
   * @param {string} id - User id
   * @param {string} attributes - Attributes
   * @returns User
   */
  async getById(id, attributes = "*") {
    return await supabase.from("Customer").select(attributes).eq("id", id);
  }

  /**
   * @description Create user
   * @param {object} user - User
   * @returns User
   */
  async create(user) {
    return await supabase.from("Customer").insert(user);
  }

  /**
   * @description Update user
   * @param {object} user - User
   * @returns User
   */
  async update(user) {
    return await supabase.from("Customer").update(user).eq("id", user.id);
  }
}

import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class CustomerApiClient
 * @description CustomerApiClient
 */
export class CustomerApiClient {
  /**
   * @description Get all customers
   * @param {string} attributes - Attributes
   * @returns Customer list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("customer", attributes);
  }

  /**
   * @description Get customer by id
   * @param {string} id - Customer id
   * @param {string} attributes - Attributes
   * @returns Customer by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("customer", id, attributes);
  }

  /**
   * @description Create customer
   * @param {object} customer - Customer
   * @returns  Transaction status
   */
  async create(customer) {
    return await saveToLocal("customer", customer);
  }

  /**
   * @description Update customer
   * @param {object} customer - Customer
   * @returns Transaction status
   */
  async update(customer) {
    return await saveToLocal("customer", customer);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("customer", ids);
  }
}

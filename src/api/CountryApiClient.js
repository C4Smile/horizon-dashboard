import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class CountryApiClient
 * @description CountryApiClient
 */
export class CountryApiClient {
  /**
   * @description Get all countries
   * @param {string} attributes - Attributes
   * @returns Country list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("country", attributes);
  }

  /**
   * @description Get country by id
   * @param {string} id - Country id
   * @param {string} attributes - Attributes
   * @returns Country by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("country", id, attributes);
  }

  /**
   * @description Create country
   * @param {object} country - Country
   * @returns  Transaction status
   */
  async create(country) {
    return await saveToLocal("country", country);
  }

  /**
   * @description Update country
   * @param {object} country - Country
   * @returns Transaction status
   */
  async update(country) {
    return await saveToLocal("country", country);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("country", ids);
  }
}

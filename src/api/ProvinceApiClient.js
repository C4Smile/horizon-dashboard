import { fetchFromLocal, fetchSingleFromLocal, saveToLocal, deleteFromLocal } from "../db/connection";

/**
 * @class ProvinceApiClient
 * @description ProvinceApiClient
 */
export class ProvinceApiClient {
  /**
   * @description Get all provinces
   * @param {string} attributes - Attributes
   * @returns Province list
   */
  async getAll(attributes = "*") {
    return await fetchFromLocal("province", attributes);
  }

  /**
   * @description Get province by id
   * @param {string} id - Province id
   * @param {string} attributes - Attributes
   * @returns Province by id
   */
  async getById(id, attributes = "*") {
    return await fetchSingleFromLocal("province", id, attributes);
  }

  /**
   * @description Create province
   * @param {object} province - Province
   * @returns  Transaction status
   */
  async create(province) {
    return await saveToLocal("province", province);
  }

  /**
   * @description Update province
   * @param {object} province - Province
   * @returns Transaction status
   */
  async update(province) {
    return await saveToLocal("province", province);
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    return await deleteFromLocal("province", ids);
  }
}

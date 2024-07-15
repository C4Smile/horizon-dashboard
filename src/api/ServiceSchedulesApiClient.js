// utils
import { makeRequest } from "../db/services";

/**
 * @class ServiceSchedulesApiClient
 * @description ServiceSchedulesApiClient
 */
export class ServiceSchedulesApiClient {
  /**
   * @description Get all serviceSchedules
   * @returns ServiceSchedules list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("serviceSchedules");
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get serviceSchedules by id
   * @param {string} id - ServiceSchedules id
   * @returns ServiceSchedules by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`serviceSchedules/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create serviceSchedules
   * @param {object} serviceSchedules - ServiceSchedules
   * @returns  Transaction status
   */
  async create(serviceSchedules) {
    // call service
    const { error, data, status } = await makeRequest("serviceSchedules", "POST", serviceSchedules);

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update serviceSchedules
   * @param {object} serviceSchedules - ServiceSchedules
   * @returns Transaction status
   */
  async update(serviceSchedules) {
    // call service
    const { status, error } = await makeRequest(
      `serviceSchedules/${serviceSchedules.id}`,
      "PUT",
      serviceSchedules,
    );
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`serviceSchedules/${id}`, "DELETE");
    }
    return { status: 204 };
  }

  /**
   * @description Delete serviceSchedules
   * @param {number} id - ServiceSchedules id
   * @returns Transaction status
   */
  async deleteSingle(id) {
    await makeRequest(`serviceSchedules/${id}`, "DELETE");
    return { status: 204 };
  }
}

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ServiceSchedulesApiClient
 * @description ServiceSchedulesApiClient
 */
export class ServiceSchedulesApiClient {
  /**
   * @description Create serviceSchedules
   * @param {object} serviceSchedules - ServiceSchedules
   * @returns  Transaction status
   */
  async create(serviceSchedules) {
    // call service
    const { error, data, status } = await makeRequest("serviceHasSchedule", "POST", serviceSchedules, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`serviceHasSchedule/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }

  /**
   * @description Delete serviceSchedules
   * @param {number} id - ServiceSchedules id
   * @returns Transaction status
   */
  async deleteSingle(id) {
    await makeRequest(`serviceHasSchedule/${id}`, "DELETE", {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

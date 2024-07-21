// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class EventSchedulesApiClient
 * @description EventSchedulesApiClient
 */
export class EventSchedulesApiClient {
  /**
   * @description Create eventSchedules
   * @param {object} eventSchedules - EventSchedules
   * @returns  Transaction status
   */
  async create(eventSchedules) {
    // call service
    const { error, data, status } = await makeRequest("eventHasSchedules", "POST", eventSchedules, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update eventSchedules
   * @param {object} eventSchedules - EventSchedules
   * @returns Transaction status
   */
  async update(eventSchedules) {
    // call service
    const { status, error } = await makeRequest(
      `eventHasSchedules/${eventSchedules.id}`,
      "PATCH",
      eventSchedules,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`eventHasSchedules/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }

  /**
   * @description Delete eventSchedules
   * @param {number} id - EventSchedules id
   * @returns Transaction status
   */
  async deleteSingle(id) {
    await makeRequest(`eventHasSchedules/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

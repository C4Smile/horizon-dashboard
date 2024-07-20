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
   * @description Get all eventSchedules
   * @returns EventSchedules list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("eventSchedules");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get eventSchedules by id
   * @param {string} id - EventSchedules id
   * @returns EventSchedules by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`eventSchedules/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create eventSchedules
   * @param {object} eventSchedules - EventSchedules
   * @returns  Transaction status
   */
  async create(eventSchedules) {
    // call service
    const { error, data, status } = await makeRequest("eventSchedules", "POST", eventSchedules, {
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
      `eventSchedules/${eventSchedules.id}`,
      "PUT",
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
      await makeRequest(`eventSchedules/${id}`, "DELETE", null, {
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
    await makeRequest(`eventSchedules/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

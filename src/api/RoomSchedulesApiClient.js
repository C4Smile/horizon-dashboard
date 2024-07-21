// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoomSchedulesApiClient
 * @description RoomSchedulesApiClient
 */
export class RoomSchedulesApiClient {
  /**
   * @description Get all roomSchedules
   * @returns RoomSchedules list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("roomSchedules");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get roomSchedules by id
   * @param {string} id - RoomSchedules id
   * @returns RoomSchedules by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`roomSchedules/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create roomSchedules
   * @param {object} roomSchedules - RoomSchedules
   * @returns  Transaction status
   */
  async create(roomSchedules) {
    // call service
    const { error, data, status } = await makeRequest("roomSchedules", "POST", roomSchedules, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update roomSchedules
   * @param {object} roomSchedules - RoomSchedules
   * @returns Transaction status
   */
  async update(roomSchedules) {
    // call service
    const { status, error } = await makeRequest(
      `roomSchedules/${roomSchedules.id}`,
      "PATCH",
      roomSchedules,
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
    for (const id of ids)
      await makeRequest(`roomSchedules/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

    return { status: 204 };
  }

  /**
   * @description Delete roomSchedules
   * @param {number} id - RoomSchedules id
   * @returns Transaction status
   */
  async deleteSingle(id) {
    await makeRequest(`roomSchedules/${id}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

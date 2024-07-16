// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";

/**
 * @class RoomStatusApiClient
 * @description RoomStatusApiClient
 */
export class RoomStatusApiClient {
  /**
   * @description Get all roomStatus
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<any[]>} RoomStatus
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`roomStatus?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get roomStatus by id
   * @param {string} id - RoomStatus id
   * @returns {Promise<any>} RoomStatus
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`roomStatus/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create roomStatus
   * @param {object} roomStatus - RoomStatus
   * @returns {Promise<any>} RoomStatus
   */
  async create(roomStatus) {
    const { error, data, status } = await makeRequest("roomStatus", "POST", roomStatus);
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update roomStatus
   * @param {object} roomStatus - RoomStatus
   * @returns {Promise<any>} RoomStatus
   */
  async update(roomStatus) {
    // call service
    const { status, error } = await makeRequest(`roomStatus/${roomStatus.id}`, "PUT", {
      ...roomStatus,
      lastUpdate: new Date().toISOString(),
    });
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`roomStatus/${id}`, "DELETE");
    }
    return { status: 204 };
  }
}

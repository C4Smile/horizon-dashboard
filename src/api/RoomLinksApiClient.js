// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class RoomLinksApiClient
 * @description RoomLinksApiClient
 */
export class RoomLinksApiClient {
  /**
   * @description Get all roomLinks
   * @returns RoomLinks list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("roomLinks");
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get roomLinks by id
   * @param {string} id - RoomLinks id
   * @returns RoomLinks by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`roomLinks/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create roomLinks
   * @param {object} roomLinks - RoomLinks
   * @returns  Transaction status
   */
  async create(roomLinks) {
    // call service
    const { error, data, status } = await makeRequest("roomLinks", "POST", roomLinks);

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update roomLinks
   * @param {object} roomLinks - RoomLinks
   * @returns Transaction status
   */
  async update(roomLinks) {
    // call service
    const { status, error } = await makeRequest(`roomLinks/${roomLinks.id}`, "PUT", roomLinks);
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
      await makeRequest(`roomLinks/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }

  /**
   * @description Get roomLinks by roomId
   * @param {number} linkId - RoomLinks id
   * @param {number} url - RoomLinks id
   * @returns RoomLinks by roomId
   */
  async deleteByUrl(linkId, url) {
    await makeRequest(`roomLinks/${linkId}/${url}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

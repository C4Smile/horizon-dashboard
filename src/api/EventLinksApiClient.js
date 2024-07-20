// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class EventLinksApiClient
 * @description EventLinksApiClient
 */
export class EventLinksApiClient {
  /**
   * @description Get all eventLinks
   * @returns EventLinks list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("eventLinks");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get eventLinks by id
   * @param {string} id - EventLinks id
   * @returns EventLinks by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`eventLinks/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create eventLinks
   * @param {object} eventLinks - EventLinks
   * @returns  Transaction status
   */
  async create(eventLinks) {
    // call service
    const { error, data, status } = await makeRequest("eventLinks", "POST", eventLinks, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update eventLinks
   * @param {object} eventLinks - EventLinks
   * @returns Transaction status
   */
  async update(eventLinks) {
    // call service
    const { status, error } = await makeRequest(`eventLinks/${eventLinks.id}`, "PUT", eventLinks, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
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
      await makeRequest(`eventLinks/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }

  /**
   * @description Get eventLinks by eventId
   * @param {number} linkId - EventLinks id
   * @param {number} url - EventLinks id
   * @returns EventLinks by eventId
   */
  async deleteByUrl(linkId, url) {
    await makeRequest(`eventLinks/${linkId}/${url}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

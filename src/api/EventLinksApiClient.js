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
   * @description Create eventLinks
   * @param {object} eventLinks - EventLinks
   * @returns  Transaction status
   */
  async create(eventLinks) {
    // call service
    const { error, data, status } = await makeRequest("event/links", "POST", eventLinks, {
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
      await makeRequest(`event/links/${id}`, "DELETE", null, {
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
    await makeRequest(`event/links/${linkId}/${url}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

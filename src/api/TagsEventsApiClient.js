// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TagsEventsApiClient
 * @description TagsEventsApiClient
 */
export class TagsEventsApiClient {
  /**
   * @description Create tagsEvents
   * @param {object} tagsEvents - TagsEvents
   * @returns  Transaction status
   */
  async create(tagsEvents) {
    // call service
    const { error, data, status } = await makeRequest("eventHasTags", "POST", tagsEvents, {
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
      await makeRequest(`eventHasTags/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }

  /**
   * @description Get a tagsEvent by eventId
   * @param {number} tagId - Tag id
   * @param {number} eventId - Event id
   * @returns Status
   */
  async deleteByEvent(tagId, eventId) {
    await makeRequest(`event/${eventId}/tags/${tagId}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

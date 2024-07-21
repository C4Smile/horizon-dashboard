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
   * @description Create tagsEvent
   * @param {object} tagsEvent - TagsEvent
   * @returns  Transaction status
   */
  async create(tagsEvent) {
    // call service
    const { error, data, status } = await makeRequest("eventHasTag", "POST", tagsEvent, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a tagsEvent by eventId
   * @param {number} tagId - Tag id
   * @param {number} eventId - Event id
   * @returns Status
   */
  async delete(tagId, eventId) {
    await makeRequest(
      `eventHasTag`,
      "DELETE",
      { tagId, eventId },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    return { status: 204 };
  }
}

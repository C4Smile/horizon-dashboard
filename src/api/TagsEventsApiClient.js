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
   * @description Get all tagsEvents
   * @returns TagsEvents list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("tagsEvents");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get tagsEvents by id
   * @param {string} id - TagsEvents id
   * @returns TagsEvents by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`tagsEvents/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create tagsEvents
   * @param {object} tagsEvents - TagsEvents
   * @returns  Transaction status
   */
  async create(tagsEvents) {
    // call service
    const { error, data, status } = await makeRequest("tagsEvents", "POST", tagsEvents, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tagsEvents
   * @param {object} tagsEvents - TagsEvents
   * @returns Transaction status
   */
  async update(tagsEvents) {
    // call service
    const { status, error } = await makeRequest(`tagsEvents/${tagsEvents.id}`, "PUT", tagsEvents, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
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
      await makeRequest(`tagsEvents/${id}`, "DELETE", null, {
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
    await makeRequest(`tagsEvents/${tagId}/events/${eventId}`, "DELETE", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }
}

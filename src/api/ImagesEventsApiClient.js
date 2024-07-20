// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ImagesEventsApiClient
 * @description ImagesEventsApiClient
 */
export class ImagesEventsApiClient {
  /**
   * @description Get all imagesEvents
   * @returns ImagesEvents list
   */
  async getAll() {
    const { error, data, status } = await makeRequest("imagesEvents");
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get imagesEvents by id
   * @param {string} id - ImagesEvents id
   * @returns ImagesEvents by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`imagesEvents/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create imagesEvents
   * @param {object} imagesEvents - ImagesEvents
   * @returns  Transaction status
   */
  async create(imagesEvents) {
    // call service
    const { error, data, status } = await makeRequest("imagesEvents", "POST", imagesEvents, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update imagesEvents
   * @param {object} imagesEvents - ImagesEvents
   * @returns Transaction status
   */
  async update(imagesEvents) {
    // call service
    const { status, error } = await makeRequest(
      `imagesEvents/${imagesEvents.id}`,
      "PUT",
      imagesEvents,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
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
      await makeRequest(`imagesEvents/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    }
    return { status: 204 };
  }
}

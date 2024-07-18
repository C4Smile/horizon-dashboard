import { PushNotification } from "../models/pushNotification/PushNotification";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class PushNotificationApiClient
 * @description PushNotificationApiClient
 */
export class PushNotificationApiClient {
  /**
   * @description Get all pushNotifications
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<PushNotification[]>} Countries
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`pushNotification?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get pushNotification by id
   * @param {string} id - PushNotification id
   * @returns {Promise<PushNotification>} PushNotification
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`pushNotification/${id}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create pushNotification
   * @param {PushNotification} pushNotification - PushNotification
   * @param {object} photo - PushNotification photo
   * @returns {Promise<PushNotification>} PushNotification
   */
  async create(pushNotification, photo) {
    // parsing sent date
    // parsing sent date
    pushNotification.sentDate = new Date(pushNotification?.sentDate ?? Date.now()).toISOString();
    // saving image
    if (photo) pushNotification.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("pushNotification", "POST", pushNotification, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, data, statusCode: status, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update pushNotification
   * @param {PushNotification} pushNotification - PushNotification
   * @param {object} photo - PushNotification photo
   * @returns {Promise<PushNotification>} PushNotification
   */
  async update(pushNotification, photo) {
    // parsing sent date
    pushNotification.sentDate = new Date(pushNotification?.sentDate ?? Date.now()).toISOString();
    // saving photo
    if (photo) pushNotification.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `pushNotification/${pushNotification.id}`,
      "PUT",
      {
        ...pushNotification,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`pushNotification/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

import { Activity } from "../models/activity/Activity";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ActivityApiClient
 * @description ActivityApiClient
 */
export class ActivityApiClient {
  /**
   * @description Get all activity
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns {Promise<Activity[]>} Activity
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`activity?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get activity by id
   * @param {string} id - Activity id
   * @returns {Promise<Activity>} Activity
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`activity/${id}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Get activity by id
   * @param {string} entity - Activity id
   * @returns {Promise<Activity>} some entity
   */
  async getEntity(entity) {
    const { data, error, status } = await makeRequest(`${entity}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Create activity
   * @param {Activity} activity - Activity
   * @param {object} photo - Activity photo
   * @returns {Promise<Activity>} Activity
   */
  async create(activity, photo) {
    // saving image
    if (photo) activity.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("activity", "POST", activity, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, data, statusCode: status, message: error.message };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update activity
   * @param {Activity} activity - Activity
   * @param {object} photo - Photo to keep
   * @returns {Promise<Activity>} Activity
   */
  async update(activity, photo) {
    // saving photo
    if (photo) activity.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `activity/${activity.id}`,
      "PUT",
      {
        ...activity,
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
      await makeRequest(`activity/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

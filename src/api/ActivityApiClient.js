import { Activity } from "../models/activity/Activity";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class ActivityApiClient
 * @description ActivityApiClient
 */
export class ActivityApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "activity";
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
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", activity, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

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
      "PATCH",
      {
        ...activity,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }
}

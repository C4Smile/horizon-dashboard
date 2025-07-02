// types
import { PushNotification } from "../lib/models/pushNotification/PushNotification";
import { Photo } from "src/lib/models/photo/Photo";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class PushNotificationApiClient
 * @description PushNotificationApiClient
 */
export class PushNotificationApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "pushNotification";
  }

  /**
   * @description Create pushNotification
   * @param pushNotification - PushNotification
   * @param photo - PushNotification photo
   * @returns PushNotification
   */
  async create(pushNotification: PushNotification, photo: Photo) {
    // parsing sent date
    // parsing sent date
    pushNotification.sentDate = new Date(
      pushNotification?.sentDate ?? Date.now()
    ).toISOString();
    // saving image
    if (photo) pushNotification.image = photo;
    // call service
    const { error, status } = await makeRequest(
      this.baseUrl,
      "POST",
      pushNotification,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update pushNotification
   * @param pushNotification - PushNotification
   * @param photo - PushNotification photo
   * @returns PushNotification
   */
  async update(pushNotification: PushNotification, photo: Photo) {
    // parsing sent date
    pushNotification.sentDate = new Date(
      pushNotification?.sentDate ?? Date.now()
    ).toISOString();
    // saving photo
    if (photo) pushNotification.image = photo;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${pushNotification.id}`,
      "PATCH",
      {
        ...pushNotification,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }
}

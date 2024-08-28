import { Application } from "../models/application/Application";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ApplicationApiClient
 * @description ApplicationApiClient
 */
export class ApplicationApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "application";
  }

  /**
   * @description Create application
   * @param {Application} application - Application
   * @param {object} photo - Application photo
   * @returns {Promise<Application>} Application
   */
  async create(application, photo) {
    // saving image
    if (photo) application.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", application, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update application
   * @param {Application} application - Application
   * @param {object} photo - Photo to keep
   * @returns {Promise<Application>} Application
   */
  async update(application, photo) {
    // saving photo
    if (photo) application.imageId = photo.id;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${application.id}`,
      "PATCH",
      {
        ...application,
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

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class ExternalLinkApiClient
 * @description ExternalLinkApiClient
 */
export class ExternalLinkApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "externalLink";
  }

  /**
   * @description Create externalLink
   * @param {object} externalLink - ExternalLink
   * @returns {Promise<any[]>} ExternalLink
   */
  async create(externalLink) {
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", externalLink, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update externalLink
   * @param {object} externalLink - ExternalLink
   * @returns {Promise<any[]>} ExternalLink
   */
  async update(externalLink) {
    // call service
    const { status, error } = await makeRequest(
      `externalLink/${externalLink.id}`,
      "PATCH",
      {
        ...externalLink,
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

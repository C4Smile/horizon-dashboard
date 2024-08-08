import { Tag } from "../models/tag/Tag";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseAPiClient } from "./utils/BaseApiClient";

/**
 * @class TagApiClient
 * @description TagApiClient
 */
export class TagApiClient extends BaseAPiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "tag";
  }

  /**
   * @description Create tag
   * @param {Tag} tag - Tag
   * @returns {Promise<Tag>} Tag
   */
  async create(tag) {
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", tag, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tag
   * @param {Tag} tag - Tag
   * @returns {Promise<Tag>} Tag
   */
  async update(tag) {
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${tag.id}`,
      "PATCH",
      {
        ...tag,
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

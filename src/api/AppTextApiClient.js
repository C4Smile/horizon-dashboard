import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class AppTextApiClient
 * @description AppTextApiClient
 */
export class AppTextApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "appText";
  }

  /**
   * @description Create appText
   * @param {object} appText - AppText
   * @returns {Promise<any>} AppText
   */
  async create(appText) {
    // default values
    appText.urlName = toSlug(appText.title);
    // parsing html
    appText.content = appText.content
      ? draftToHtml(convertToRaw(appText.content.getCurrentContent()))
      : "";
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", appText, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update appText
   * @param {object} appText - AppText
   * @returns {Promise<any>} AppText
   */
  async update(appText) {
    // default values
    appText.urlName = toSlug(appText.title);
    // parsing html
    appText.content = appText.content
      ? draftToHtml(convertToRaw(appText.content.getCurrentContent()))
      : "";
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${appText.id}`,
      "PATCH",
      {
        ...appText,
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

import { Language } from "../models/language/Language.js";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class LanguageApiClient
 * @description LanguageApiClient
 */
export class LanguageApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "lang";
  }

  /**
   * @description Create language
   * @param {Language} language - Language
   * @returns {Promise<Language>} Language
   */
  async create(language) {
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", language, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update language
   * @param {Language} language - Language
   * @returns {Promise<Language>} Language
   */
  async update(language) {
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${language.id}`,
      "PATCH",
      {
        ...language,
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

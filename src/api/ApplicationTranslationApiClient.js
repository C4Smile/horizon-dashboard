import { ApplicationTranslation } from "../models/applicationTranslation/ApplicationTranslation";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class ApplicationTranslationApiClient
 * @description ApplicationTranslationApiClient
 */
export class ApplicationTranslationApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "applicationTranslation";
    this.langTranslation = "langTranslation";
  }

  /**
   *
   * @param {number} langId - lang id
   * @returns list of translations
   */
  async getLangTranslations(langId) {
    const { error, data, status } = await makeRequest(`${this.langTranslation}/byLangId/${langId}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @param {number} appId - application to filter by
   * @returns list of application translations
   */
  async getByApplication(appId) {
    const { error, data, status } = await makeRequest(`${this.baseUrl}/byApplicationId/${appId}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Create applicationTranslation
   * @param {ApplicationTranslation} applicationTranslation - ApplicationTranslation
   * @returns {Promise<ApplicationTranslation>} ApplicationTranslation
   */
  async create(applicationTranslation) {
    // call service
    const { error, data, status } = await makeRequest(this.baseUrl, "POST", applicationTranslation, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update applicationTranslation
   * @param {ApplicationTranslation} applicationTranslation - ApplicationTranslation
   * @returns {Promise<ApplicationTranslation>} ApplicationTranslation
   */
  async update(applicationTranslation) {
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/updateLangTranslation`,
      "POST",
      {
        appTranslationId: applicationTranslation.id,
        langId: applicationTranslation.langId,
        content: applicationTranslation.content,
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   *
   * @param {string} csvContent - csv content
   * @param {number} appId - app to upload to
   * @returns {Promise<object>} result
   */
  async uploadFile(csvContent, appId) {
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${appId}/upload-translations`,
      "POST",
      {
        content: csvContent,
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    return { error, status: status === 204 ? 201 : status };
  }
}

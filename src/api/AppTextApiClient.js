import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class AppTextApiClient
 * @description AppTextApiClient
 */
export class AppTextApiClient {
  /**
   * @description Get all appTexts
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<any[]>} AppTexts
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`appTexts?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get appText by id
   * @param {string} id - AppText id
   * @returns {Promise<any>} AppText
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`appTexts/${id}`, "GET", null, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
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
      : null;
    const { error, data, status } = await makeRequest("appTexts", "POST", appText, {
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
      : null;
    // call service
    const { status, error } = await makeRequest(
      `appTexts/${appText.id}`,
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

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`appTexts/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

    return { status: 204 };
  }
}

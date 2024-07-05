import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";

/**
 * @class TagApiClient
 * @description TagApiClient
 */
export class TagApiClient {
  /**
   * @description Get all tags
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<any[]>} Tags
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest("tags");
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get tag by id
   * @param {string} id - Tag id
   * @returns {Promise<any>} Tag
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`tags/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
  }

  /**
   * @description Create tag
   * @param {object} tag - Tag
   * @returns {Promise<any>} Tag
   */
  async create(tag) {
    // default values
    tag.urlName = toSlug(tag.title);
    // parsing html
    tag.content = tag.content ? draftToHtml(convertToRaw(tag.content.getCurrentContent())) : null;
    const { error, data, status } = await makeRequest("tags", "POST", tag);
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tag
   * @param {object} tag - Tag
   * @returns {Promise<any>} Tag
   */
  async update(tag) {
    // default values
    tag.urlName = toSlug(tag.title);
    // parsing html
    tag.content = tag.content ? draftToHtml(convertToRaw(tag.content.getCurrentContent())) : null;
    // call service
    const { status, error } = await makeRequest(`tags/${tag.id}`, "PUT", tag);
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) {
      await makeRequest(`tags/${id}`, "DELETE");
    }
    return { status: 204 };
  }
}

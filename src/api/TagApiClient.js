import { Tag } from "../models/tag/Tag";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

/**
 * @class TagApiClient
 * @description TagApiClient
 */
export class TagApiClient {
  /**
   * @description Get all tag
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns {Promise<Tag[]>} Tag
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { data, error, status } = await makeRequest(`tag?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get tag by id
   * @param {string} id - Tag id
   * @returns {Promise<Tag>} Tag
   */
  async getById(id) {
    const { data, error, status } = await makeRequest(`tag/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create tag
   * @param {Tag} tag - Tag
   * @returns {Promise<Tag>} Tag
   */
  async create(tag) {
    // call service
    const { error, data, status } = await makeRequest("tag", "POST", tag, {
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
      `tag/${tag.id}`,
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

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    const { data, status, error } = await makeRequest(`tag`, "DELETE", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, error, status: status === 200 ? 204 : status };
  }

  /**
   * Restore elements by their id
   * @param {number[]} ids to restore
   * @returns Transaction status
   */
  async restore(ids) {
    const { data, status, error } = await makeRequest(`tag/restore`, "PATCH", ids, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { data, error, status: status === 200 ? 204 : status };
  }
}

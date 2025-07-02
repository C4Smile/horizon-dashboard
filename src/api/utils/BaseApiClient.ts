// services
import { makeRequest } from "./services";

// utils
import { fromLocal } from "../../utils/local";

// config
import config from "../../config";

// base
import { APIClient } from "./APIClient";

// types
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  DeleteDto,
  QueryResult,
} from "lib";
import { Tables } from "../types";

/**
 * @class BaseApiClient
 * @description it has all base method
 */
export class BaseApiClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter,
> {
  table: Tables;
  api: APIClient = new APIClient();

  /**
   *
   * @param table
   */
  constructor(table: Tables) {
    this.table = table;
  }

  /**
   * @param userId user locker
   * @param entityId entity id to lock
   * @returns result of http
   */
  async lock(userId: number, entityId: number) {
    const { data, error, status } = await this.api.patch(
      `${this.table}/${entityId}/lock`,
      {
        userId,
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @param entityId entity id to lock
   * @returns {Promise<{error: {message: string}, status: number}|any>} result of http
   */
  async release(entityId: number) {
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}/${entityId}/release`,
      "PATCH",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get all objects
   * @param {object} query - query parameters
   * @returns {Promise<object[]> | object} Result list
   */
  async getAll(
    query = {
      sortingBy: "id",
      sortingOrder: "asc",
      currentPage: 0,
      pageSize: 50,
    }
  ) {
    const { sortingBy, sortingOrder, currentPage, pageSize } = query;
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}?sort=${sortingBy}&order=${sortingOrder}&page=${currentPage}&count=${pageSize}`
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get entity by id
   * @param {string} id - object id
   * @returns {Promise<object>} object
   */
  async getById(id: number) {
    const { data, error, status } = await makeRequest(
      `${this.baseUrl}/${id}`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids: number[]) {
    const { data, status, error } = await makeRequest(
      `${this.baseUrl}`,
      "DELETE",
      ids,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return { data, error, status: status === 200 ? 204 : status };
  }

  /**
   * Restore elements by their id
   * @param {number[]} ids to restore
   * @returns Transaction status
   */
  async restore(ids: number[]) {
    const { data, status, error } = await makeRequest(
      `${this.baseUrl}/restore`,
      "PATCH",
      ids,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return { data, error, status: status === 200 ? 204 : status };
  }
}

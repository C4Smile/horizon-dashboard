// services
import { makeRequest } from "./services";

// utils
import { fromLocal } from "../../utils/local";

// config
import config from "../../config";

// lib
import { IdDto } from "lib";

/**
 * @class BaseManyApiClient
 * @description BaseManyApiClient
 */
export class BaseManyApiClient<TManyDto extends IdDto> {
  baseUrl = "";
  idAttribute = "";
  idsAttribute = "";

  /**
   *
   * @param baseUrl string url
   * @param idAttribute id url
   * @param idsAttribute ids url
   */
  constructor(baseUrl: string, idAttribute: string, idsAttribute: string) {
    this.baseUrl = baseUrl;
    this.idAttribute = idAttribute;
    this.idsAttribute = idsAttribute;
  }

  /**
   * @param {number} entityId id of the entity
   * @returns many relationships
   */
  async get(entityId: number) {
    // call service
    const { error, data, status } = await makeRequest(
      `${this.baseUrl}/${entityId}`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );

    return { error, items: data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Create techCosts
   * @param entityId tech to save
   * @param object - BaseMany
   * @returns Transaction status
   */
  async save(entityId: number, object: TManyDto) {
    // call service
    const { error, data, status } = await makeRequest(
      `${this.baseUrl}/${entityId}`,
      object.id ? "PATCH" : "POST",
      object,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Get a techCosts by newsId
   * @param entityId - Tag id
   * @param list - News id
   * @returns Status
   */
  async delete(entityId: number, list: number[]) {
    await makeRequest(`${this.baseUrl}/${entityId}`, "DELETE", list, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return { status: 204 };
  }

  /**
   * @description Get a techCosts by newsId
   * @param entityId - Entity id
   * @param remoteId - Remote id
   * @returns Status
   */
  async deleteSingle(entityId: number, remoteId: number) {
    await makeRequest(
      `${this.baseUrl}/${entityId}/${remoteId}`,
      "DELETE",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return { status: 204 };
  }
}

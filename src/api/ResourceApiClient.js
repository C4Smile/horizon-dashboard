import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class ResourceApiClient
 * @description ResourceApiClient
 */
export class ResourceApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "resources";
  }

  /**
   * @description Create resource
   * @param {object} resource - Resource
   * @param {object[]} photo - Photo
   * @returns Transaction status
   */
  async create(resource, photo) {
    // default values
    resource.urlName = toSlug(resource.name);
    // parsing html
    resource.description = draftToHtml(convertToRaw(resource.description.getCurrentContent()));
    // saving photo
    if (photo) resource.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("resources", "POST", resource, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update resource
   * @param {object} resource - Resource
   * @param {object[]} photo -
   * @returns Transaction status
   */
  async update(resource, photo) {
    // default values
    resource.urlName = toSlug(resource.name);
    // parsing html
    resource.description = draftToHtml(convertToRaw(resource.description.getCurrentContent()));
    // saving photo
    if (photo) resource.imageId = photo.id;
    // cleaning relation ships
    delete resource.tagsId;
    delete resource.resourceHasTag;
    delete resource.resourceHasImage;
    // call service
    const { status, error } = await makeRequest(
      `resources/${resource.id}`,
      "PATCH",
      {
        ...resource,
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
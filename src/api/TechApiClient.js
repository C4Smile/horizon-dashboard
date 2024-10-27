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
 * @class TechApiClient
 * @description TechApiClient
 */
export class TechApiClient extends BaseApiClient {
  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "techs";
  }

  /**
   * @description Create tech
   * @param {object} tech - Tech
   * @param {object[]} photo - Photo
   * @returns Transaction status
   */
  async create(tech, photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(convertToRaw(tech.description.getCurrentContent()));
    // saving photo
    if (photo) tech.imageId = photo.id;
    // call service
    const { error, data, status } = await makeRequest("techs", "POST", tech, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tech
   * @param {object} tech - Tech
   * @param {object[]} photo - photo
   * @returns Transaction status
   */
  async update(tech, photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(convertToRaw(tech.description.getCurrentContent()));
    // saving photo
    if (photo) tech.imageId = photo.id;
    // cleaning relation ships
    delete tech.tagsId;
    delete tech.techHasTag;
    delete tech.techHasImage;
    // call service
    const { status, error } = await makeRequest(
      `techs/${tech.id}`,
      "PATCH",
      {
        ...tech,
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
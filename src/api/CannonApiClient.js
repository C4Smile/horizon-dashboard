import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { CannonCostsApiClient } from "./CannonCostsApiClient.js";
import { CannonReqTechsApiClient } from "./CannonReqTechsApiClient.js";
import { CannonReqBuildingsApiClient } from "./CannonReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// types
import { Cannon } from "../models/cannon/Cannon.js";
import { Photo } from "../models/photo/Photo.js";

/**
 * @class CannonApiClient
 * @description CannonApiClient
 */
export class CannonApiClient extends BaseApiClient {
  cannonCosts = new CannonCostsApiClient();
  cannonReqTechs = new CannonReqTechsApiClient();
  cannonReqBuildings = new CannonReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "cannons";
  }

  /**
   * @description Create cannon
   * @param {Cannon} cannon - Cannon
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async create(cannon, photo) {
    // default values
    cannon.urlName = toSlug(cannon.name);
    // parsing html
    cannon.description = draftToHtml(convertToRaw(cannon.description.getCurrentContent()));
    // saving photo
    if (photo) cannon.image = photo;
    // call service
    const { error, data, status } = await makeRequest("cannons", "POST", cannon, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update cannon
   * @param {Cannon} cannon - Cannon
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async update(cannon, photo) {
    // default values
    cannon.urlName = toSlug(cannon.name);
    // parsing html
    cannon.description = draftToHtml(convertToRaw(cannon.description.getCurrentContent()));
    // saving photo
    if (photo) cannon.image = photo;
    // call service
    const { status, error } = await makeRequest(
      `cannons/${cannon.id}`,
      "PATCH",
      {
        ...cannon,
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

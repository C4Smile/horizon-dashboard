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

// api
import { TechCostsApiClient } from "./TechCostsApiClient";
import { TechProducesApiClient } from "./TechProducesApiClient";
import { TechReqTechsApiClient } from "./TechReqTechsApiClient";
import { TechReqBuildingsApiClient } from "./TechReqBuildingsApiClient";

// types
import { Tech } from "../models/tech/Tech.js";
import { Photo } from "../models/photo/Photo.js";

/**
 * @class TechApiClient
 * @description TechApiClient
 */
export class TechApiClient extends BaseApiClient {
  techCosts = new TechCostsApiClient();
  techProductions = new TechProducesApiClient();
  techReqTechs = new TechReqTechsApiClient();
  techReqBuildings = new TechReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "techs";
  }

  /**
   * @description Create tech
   * @param {Tech} tech - Tech
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async create(tech, photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(convertToRaw(tech.description.getCurrentContent()));
    // saving photo
    if (photo) tech.image = photo;
    // call service
    const { error, data, status } = await makeRequest("techs", "POST", tech, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update tech
   * @param {Tech} tech - Tech
   * @param {Photo} photo - photo
   * @returns Transaction status
   */
  async update(tech, photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(convertToRaw(tech.description.getCurrentContent()));
    // saving photo
    if (photo) tech.image = photo;
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

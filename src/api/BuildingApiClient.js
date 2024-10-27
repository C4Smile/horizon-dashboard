import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { BuildingProducesApiClient } from "./BuildingProducesApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class BuildingApiClient
 * @description BuildingApiClient
 */
export class BuildingApiClient extends BaseApiClient {
  buildingProduces = new BuildingProducesApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "building";
  }

  /**
   * @description Create building
   * @param {object} building - Building
   * @param {object[]} photo - Photo
   * @returns Transaction status
   */
  async create(building, photo) {
    // default values
    building.urlName = toSlug(building.title);
    // parsing html
    building.content = draftToHtml(convertToRaw(building.content.getCurrentContent()));
    // saving photo
    if (photo) building.imageId = photo.id;
    // cleaning relation ships
    delete building.produces;
    // call service
    const { error, data, status } = await makeRequest("buildings", "POST", building, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update building
   * @param {object} building - Building
   * @param {object[]} photo - Photo
   * @returns Transaction status
   */
  async update(building, photo) {
    // default values
    building.urlName = toSlug(building.title);
    // parsing html
    building.content = draftToHtml(convertToRaw(building.content.getCurrentContent()));
    // saving photo
    if (photo) building.imageId = photo.id;
    // parsing produces
    const producesToKeep = parseManyToMany("resourceId", building.newProduces, building.produces);
    // cleaning relation ships
    delete building.produces;
    delete building.newProduces;
    // call service
    const { status, error } = await makeRequest(
      `buildings/${building.id}`,
      "PATCH",
      {
        ...building,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships
    for (const produces of producesToKeep) {
      if (produces.delete) this.buildingProduces.delete(produces.resourceId, building.Id);
      else this.buildingProduces.create({ buildingId: building.id, resourceId: produces.resourceId });
    }

    return { error, status: status === 204 ? 201 : status };
  }
}

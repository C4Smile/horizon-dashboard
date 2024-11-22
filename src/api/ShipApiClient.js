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
import { ShipCostsApiClient } from "./ShipCostsApiClient.js";
import { ShipReqTechsApiClient } from "./ShipReqTechsApiClient.js";
import { ShipUpkeepsApiClient } from "./ShipUpkeepsApiClient.js";
import { ShipReqBuildingsApiClient } from "./ShipReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// types
import { Ship } from "../models/ship/Ship.js";
import { Photo } from "../models/photo/Photo.js";

/**
 * @class ShipApiClient
 * @description ShipApiClient
 */
export class ShipApiClient extends BaseApiClient {
  shipCosts = new ShipCostsApiClient();
  shipUpkeeps = new ShipUpkeepsApiClient();
  shipReqTechs = new ShipReqTechsApiClient();
  shipReqBuildings = new ShipReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "ships";
  }

  /**
   * @description Create ship
   * @param {Ship} ship - Ship
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async create(ship, photo) {
    // default values
    ship.urlName = toSlug(ship.name);
    // parsing html
    ship.description = draftToHtml(convertToRaw(ship.description.getCurrentContent()));
    // saving photo
    if (photo) ship.image = photo;
    // call service
    const { error, data, status } = await makeRequest("ships", "POST", ship, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };
    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update ship
   * @param {Ship} ship - Ship
   * @param {Photo} photo - Photo
   * @returns Transaction status
   */
  async update(ship, photo) {
    // default values
    ship.urlName = toSlug(ship.name);
    // parsing html
    ship.description = draftToHtml(convertToRaw(ship.description.getCurrentContent()));
    // saving photo
    if (photo) ship.image = photo;
    // call service
    const { status, error } = await makeRequest(
      `ships/${ship.id}`,
      "PATCH",
      {
        ...ship,
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

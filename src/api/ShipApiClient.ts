import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// apis
import { ShipCostsApiClient } from "./ShipCostsApiClient.js";
import { ShipReqTechsApiClient } from "./ShipReqTechsApiClient.js";
import { ShipUpkeepsApiClient } from "./ShipUpkeepsApiClient.js";
import { ShipReqBuildingsApiClient } from "./ShipReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import {
  ShipAddDto,
  ShipCommonDto,
  ShipDto,
  ShipFilterDto,
  ShipUpdateDto,
} from "lib";

/**
 * @class ShipApiClient
 * @description ShipApiClient
 */
export class ShipApiClient extends BaseApiClient<
  ShipDto,
  ShipCommonDto,
  ShipAddDto,
  ShipUpdateDto,
  ShipFilterDto
> {
  shipCosts = new ShipCostsApiClient();
  shipUpkeeps = new ShipUpkeepsApiClient();
  shipReqTechs = new ShipReqTechsApiClient();
  shipReqBuildings = new ShipReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super(Tables.Ships);
  }

  /**
   * @description Create ship
   * @param ship - Ship
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(ship: Ship, photo: Photo) {
    // default values
    ship.urlName = toSlug(ship.name);
    // parsing html
    ship.description = draftToHtml(
      convertToRaw(ship.description.getCurrentContent()),
    );
    // saving photo
    if (photo) ship.image = photo;
  }

  /**
   * @description Update ship
   * @param ship - Ship
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(ship: Ship, photo: Photo) {
    // default values
    ship.urlName = toSlug(ship.name);
    // parsing html
    ship.description = draftToHtml(
      convertToRaw(ship.description.getCurrentContent()),
    );
    // saving photo
    if (photo) ship.image = photo;
  }
}

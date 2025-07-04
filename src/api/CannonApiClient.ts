import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// apis
import { CannonCostsApiClient } from "./CannonCostsApiClient.js";
import { CannonReqTechsApiClient } from "./CannonReqTechsApiClient.js";
import { CannonReqBuildingsApiClient } from "./CannonReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/";

// types
import { Tables } from "./types/";

// lib
import {
  CannonDto,
  CannonCommonDto,
  CannonAddDto,
  CannonUpdateDto,
  CannonFilterDto,
} from "lib";

/**
 * @class CannonApiClient
 * @description CannonApiClient
 */
export class CannonApiClient extends BaseApiClient<
  CannonDto,
  CannonCommonDto,
  CannonAddDto,
  CannonUpdateDto,
  CannonFilterDto
> {
  cannonCosts = new CannonCostsApiClient();
  cannonReqTechs = new CannonReqTechsApiClient();
  cannonReqBuildings = new CannonReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super(Tables.Cannons);
  }

  /**
   * @description Create cannon
   * @param cannon - Cannon
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(cannon: Cannon, photo: Photo) {
    // default values
    cannon.urlName = toSlug(cannon.name);
    // parsing html
    cannon.description = draftToHtml(
      convertToRaw(cannon.description.getCurrentContent())
    );
    // saving photo
    if (photo) cannon.image = photo;
  }

  /**
   * @description Update cannon
   * @param cannon - Cannon
   * @param photo - Photo
   * @returns Transaction status
   */
  async update(cannon: Cannon, photo: Photo) {
    // default values
    cannon.urlName = toSlug(cannon.name);
    // parsing html
    cannon.description = draftToHtml(
      convertToRaw(cannon.description.getCurrentContent())
    );
    // saving photo
    if (photo) cannon.image = photo;
    // lastUpdate: new Date().toISOString(),
  }
}

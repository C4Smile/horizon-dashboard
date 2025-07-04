import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local.js";

// config
import config from "../config.js";

// services
import { makeRequest } from "../db/services.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient.js";

// api
import { TechCostsApiClient } from "./TechCostsApiClient.js";
import { TechProducesApiClient } from "./TechProducesApiClient.js";
import { TechReqTechsApiClient } from "./TechReqTechsApiClient.js";
import { TechReqBuildingsApiClient } from "./TechReqBuildingsApiClient.js";

// types
import { Tech } from "../lib/models/tech/Tech.js";
import { Photo } from "../lib/models/photo/Photo.js";

// lib
import {
  TechDto,
  TechAddDto,
  TechUpdateDto,
  TechFilterDto,
  TechCommonDto,
} from "lib";
import { Tables } from "./types/dbUtils.js";

/**
 * @class TechApiClient
 * @description TechApiClient
 */
export class TechApiClient extends BaseApiClient<
  TechDto,
  TechCommonDto,
  TechAddDto,
  TechUpdateDto,
  TechFilterDto
> {
  techCosts = new TechCostsApiClient();
  techProductions = new TechProducesApiClient();
  techReqTechs = new TechReqTechsApiClient();
  techReqBuildings = new TechReqBuildingsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super(Tables.Techs);
  }

  /**
   * @description Create tech
   * @param tech - Tech
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(tech: Tech, photo: Photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(
      convertToRaw(tech.description.getCurrentContent())
    );
    // saving photo
    if (photo) tech.image = photo;
  }

  /**
   * @description Update tech
   * @param tech - Tech
   * @param photo - photo
   * @returns Transaction status
   */
  async update(tech: Tech, photo: Photo) {
    // default values
    tech.urlName = toSlug(tech.name);
    // parsing html
    tech.description = draftToHtml(
      convertToRaw(tech.description.getCurrentContent())
    );
    // saving photo
    if (photo) tech.image = photo;
  }
}

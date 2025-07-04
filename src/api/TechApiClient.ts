import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// base
import { BaseApiClient } from "./utils/";

// api
import { TechCostsApiClient } from "./TechCostsApiClient.js";
import { TechProducesApiClient } from "./TechProducesApiClient.js";
import { TechReqTechsApiClient } from "./TechReqTechsApiClient.js";
import { TechReqBuildingsApiClient } from "./TechReqBuildingsApiClient.js";

// types
import { Tables } from "./types/";

// lib
import {
  TechDto,
  TechAddDto,
  TechUpdateDto,
  TechFilterDto,
  TechCommonDto,
} from "lib";

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

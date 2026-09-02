import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/";
import {
  FormPhoto,
  parseHtml,
  parseId,
  parseImage,
  parseNumber,
} from "./utils/formToDto";

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
   * @description Maps the form values to what the api stores
   * @param tech - form values
   * @param photo - ImageUploader state
   * @returns tech dto
   */
  private toDto(tech: TechDto, photo: FormPhoto) {
    return {
      name: tech.name,
      urlName: toSlug(tech.name),
      description: parseHtml(tech.description),
      creationTime: parseNumber(tech.creationTime),
      typeId: parseId(tech.type ?? tech.typeId),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create tech
   * @param tech - Tech
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(tech: TechDto, photo: FormPhoto) {
    return await this.saveNew(this.toDto(tech, photo) as TechAddDto);
  }

  /**
   * @description Update tech
   * @param tech - Tech
   * @param photo - photo
   * @returns Transaction status
   */
  async update(tech: TechDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: tech.id,
      ...this.toDto(tech, photo),
    } as TechUpdateDto);
  }
}

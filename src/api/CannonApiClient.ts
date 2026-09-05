// apis
import { CannonCostsApiClient } from "./CannonCostsApiClient.js";
import { CannonReqTechsApiClient } from "./CannonReqTechsApiClient.js";
import { CannonReqBuildingsApiClient } from "./CannonReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/";
import { parseHtml, parseNumber } from "./utils/formToDto";

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
   * @description Maps the form values to what the api stores
   * the cannons table has no image column, the photo is ignored on purpose
   * @param cannon - form values
   * @returns cannon dto
   */
  private toDto(cannon: CannonDto) {
    return {
      name: cannon.name,
      description: parseHtml(cannon.description),
      creationTime: parseNumber(cannon.creationTime),
      baseDamage: parseNumber(cannon.baseDamage),
      weight: parseNumber(cannon.weight),
    };
  }

  /**
   * @description Create cannon
   * @param cannon - Cannon
   * @returns Transaction status
   */
  async createFromForm(cannon: CannonDto) {
    return await this.saveNew(this.toDto(cannon));
  }

  /**
   * @description Update cannon
   * @param cannon - Cannon
   * @returns Transaction status
   */
  async updateFromForm(cannon: CannonDto) {
    return await this.saveExisting({
      id: cannon.id,
      ...this.toDto(cannon),
    });
  }
}

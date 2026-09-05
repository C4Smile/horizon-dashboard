
// apis
import { ShipCostsApiClient } from "./ShipCostsApiClient.js";
import { ShipReqTechsApiClient } from "./ShipReqTechsApiClient.js";
import { ShipUpkeepsApiClient } from "./ShipUpkeepsApiClient.js";
import { ShipReqBuildingsApiClient } from "./ShipReqBuildingsApiClient.js";

// base
import { BaseApiClient } from "./utils/BaseApiClient";
import {
  FormPhoto,
  parseHtml,
  parseIcon,
  parseImage,
  parseNumber,
} from "./utils/formToDto";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import {
  FormValues,
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
   * @description Maps the form values to what the api stores
   * @param ship - form values
   * @param photo - ImageUploader state
   * @param icon - icon ImageUploader state
   * @returns ship dto
   */
  private toDto(ship: FormValues<ShipDto>, photo: FormPhoto, icon: FormPhoto) {
    return {
      name: ship.name ?? "",
      description: parseHtml(ship.description),
      creationTime: parseNumber(ship.creationTime),
      capacity: parseNumber(ship.capacity),
      knots: parseNumber(ship.knots),
      minCrew: parseNumber(ship.minCrew),
      bestCrew: parseNumber(ship.bestCrew),
      maxCrew: parseNumber(ship.maxCrew),
      guns: parseNumber(ship.guns),
      hull: parseNumber(ship.hull),
      ...parseImage(photo),
      ...parseIcon(icon),
    };
  }

  /**
   * @description Create ship
   * @param ship - Ship
   * @param photo - Photo
   * @param icon - Icon
   * @returns Transaction status
   */
  async createFromForm(ship: FormValues<ShipDto>, photo: FormPhoto, icon: FormPhoto) {
    return await this.saveNew(this.toDto(ship, photo, icon));
  }

  /**
   * @description Update ship
   * @param ship - Ship
   * @param photo - Photo
   * @param icon - Icon
   * @returns Transaction status
   */
  async updateFromForm(ship: FormValues<ShipDto>, photo: FormPhoto, icon: FormPhoto) {
    return await this.saveExisting({
      id: parseNumber(ship.id),
      ...this.toDto(ship, photo, icon),
    });
  }
}

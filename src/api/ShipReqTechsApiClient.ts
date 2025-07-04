// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import { ShipReqTechDto, ShipReqTechAddDto, ShipReqTechFilterDto } from "lib";

/**
 * @class ShipReqTechsApiClient
 * @description ShipReqTechsApiClient
 */
export class ShipReqTechsApiClient extends BaseManyApiClient<
  ShipReqTechDto,
  ShipReqTechAddDto,
  ShipReqTechFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.ShipReqTechs);
  }
}

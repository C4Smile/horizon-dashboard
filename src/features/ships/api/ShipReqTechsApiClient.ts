// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { ShipReqTechDto, ShipReqTechAddDto, ShipReqTechFilterDto } from "../lib";

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

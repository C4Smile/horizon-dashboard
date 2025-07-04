// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient.js";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import { ShipReqBuildingDto, ShipReqBuildingAddDto, ShipReqBuildingFilterDto } from "lib";

/**
 * @class ShipReqBuildingsApiClient
 * @description ShipReqBuildingsApiClient
 */
export class ShipReqBuildingsApiClient extends BaseManyApiClient<
  ShipReqBuildingDto,
  ShipReqBuildingAddDto,
  ShipReqBuildingFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.ShipReqBuildings);
  }
}

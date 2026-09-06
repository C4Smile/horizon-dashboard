// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  ShipReqBuildingDto,
  ShipReqBuildingAddDto,
  ShipReqBuildingFilterDto,
} from "../lib";

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

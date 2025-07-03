// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import {
  CannonReqBuildingAddDto,
  CannonReqBuildingDto,
  CannonReqBuildingFilterDto,
} from "lib";

/**
 * @class CannonReqBuildingsApiClient
 * @description CannonReqBuildingsApiClient
 */
export class CannonReqBuildingsApiClient extends BaseManyApiClient<
  CannonReqBuildingDto,
  CannonReqBuildingAddDto,
  CannonReqBuildingFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.CannonReqBuildings);
  }
}

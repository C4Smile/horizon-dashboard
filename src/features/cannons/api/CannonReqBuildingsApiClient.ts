// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  CannonReqBuildingAddDto,
  CannonReqBuildingDto,
  CannonReqBuildingFilterDto,
} from "../lib";

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

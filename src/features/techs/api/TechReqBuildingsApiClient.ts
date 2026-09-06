// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  TechReqBuildingDto,
  TechReqBuildingAddDto,
  TechReqBuildingFilterDto,
} from "../lib";

/**
 * @class TechReqBuildingsApiClient
 * @description TechReqBuildingsApiClient
 */
export class TechReqBuildingsApiClient extends BaseManyApiClient<
  TechReqBuildingDto,
  TechReqBuildingAddDto,
  TechReqBuildingFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.TechReqBuildings);
  }
}

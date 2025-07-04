// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import {
  TechReqBuildingDto,
  TechReqBuildingAddDto,
  TechReqBuildingFilterDto,
} from "lib";

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

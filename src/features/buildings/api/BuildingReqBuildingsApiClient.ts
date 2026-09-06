// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { BuildingReqBuildingDto, BuildingReqBuildingAddDto, BuildingReqBuildingFilterDto } from "../lib";

/**
 * @class BuildingReqBuildingsApiClient
 * @description BuildingReqBuildingsApiClient
 */
export class BuildingReqBuildingsApiClient extends BaseManyApiClient<
  BuildingReqBuildingDto,
  BuildingReqBuildingAddDto,
  BuildingReqBuildingFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.BuildingReqBuildings);
  }
}

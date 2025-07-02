// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../lib/models/building/Building";

/**
 * @class BuildingReqBuildingsApiClient
 * @description BuildingReqBuildingsApiClient
 */
export class BuildingReqBuildingsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.buildingRequirement, "buildingId", "buildingReqId");
  }
}

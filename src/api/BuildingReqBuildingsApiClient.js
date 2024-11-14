// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

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

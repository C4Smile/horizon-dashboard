// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

/**
 * @class ShipReqBuildingsApiClient
 * @description ShipReqBuildingsApiClient
 */
export class ShipReqBuildingsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.buildingRequirement, "shipId", "buildingReqId");
  }
}

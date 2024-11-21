// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// entity
import { Ship } from "../models/ship/Ship.js";

/**
 * @class ShipReqBuildingsApiClient
 * @description ShipReqBuildingsApiClient
 */
export class ShipReqBuildingsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Ship.buildingRequirement, "shipId", "buildingReqId");
  }
}

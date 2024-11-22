// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// entity
import { Cannon } from "../models/cannon/Cannon.js";

/**
 * @class CannonReqBuildingsApiClient
 * @description CannonReqBuildingsApiClient
 */
export class CannonReqBuildingsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Cannon.buildingRequirement, "cannonId", "buildingReqId");
  }
}

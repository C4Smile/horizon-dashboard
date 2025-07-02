// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Cannon } from "../lib/models/cannon/Cannon.js";

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

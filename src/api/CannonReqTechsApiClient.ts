
// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient.js";

// types
import { Cannon } from "../lib/models/cannon/Cannon.js";

/**
 * @class CannonReqTechsApiClient
 * @description CannonReqTechsApiClient
 */
export class CannonReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Cannon.techRequirement, "cannonId", "buildingReqId");
  }
}

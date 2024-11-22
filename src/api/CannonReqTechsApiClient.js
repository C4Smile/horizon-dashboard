// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// entity
import { Cannon } from "../models/cannon/Cannon.js";

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

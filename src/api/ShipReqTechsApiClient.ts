// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Ship } from "../lib/models/ship/Ship.js";

/**
 * @class ShipReqTechsApiClient
 * @description ShipReqTechsApiClient
 */
export class ShipReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Ship.techRequirement, "shipId", "buildingReqId");
  }
}

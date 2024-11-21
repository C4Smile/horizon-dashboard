// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// entity
import { Ship } from "../models/ship/Ship.js";

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

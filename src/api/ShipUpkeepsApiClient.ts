// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient.js";

// types
import { Ship } from "../models/ship/Ship.js";

/**
 * @class ShipUpkeepsApiClient
 * @description ShipUpkeepsApiClient
 */
export class ShipUpkeepsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Ship.upkeeps, "shipId", "resourceId");
  }
}

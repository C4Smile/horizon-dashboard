// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Ship } from "../lib/models/ship/Ship";

/**
 * @class ShipCostsApiClient
 * @description ShipCostsApiClient
 */
export class ShipCostsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Ship.costs, "shipId", "resourceId");
  }
}

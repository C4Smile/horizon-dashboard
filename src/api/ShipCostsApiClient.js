// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Ship } from "../models/ship/Ship";

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

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

/**
 * @class ShipUpkeepsApiClient
 * @description ShipUpkeepsApiClient
 */
export class ShipUpkeepsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.upkeeps, "shipId", "resourceId");
  }
}

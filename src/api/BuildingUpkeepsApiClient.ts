// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../models/building/Building";

/**
 * @class BuildingUpkeepsApiClient
 * @description BuildingUpkeepsApiClient
 */
export class BuildingUpkeepsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.upkeeps, "buildingId", "resourceId");
  }
}

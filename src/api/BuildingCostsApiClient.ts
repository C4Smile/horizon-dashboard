// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../lib/models/building/Building";

/**
 * @class BuildingCostsApiClient
 * @description BuildingCostsApiClient
 */
export class BuildingCostsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.costs, "buildingId", "resourceId");
  }
}

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../models/building/Building";

/**
 * @class BuildingProducesApiClient
 * @description BuildingProducesApiClient
 */
export class BuildingProducesApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.resourceUpgrade, "buildingId", "resourceId");
  }
}

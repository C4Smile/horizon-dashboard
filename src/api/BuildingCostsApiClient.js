// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

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

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../lib/models/building/Building";

/**
 * @class BuildingReqTechsApiClient
 * @description BuildingReqTechsApiClient
 */
export class BuildingReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.techRequirement, "buildingId", "buildingReqId");
  }
}

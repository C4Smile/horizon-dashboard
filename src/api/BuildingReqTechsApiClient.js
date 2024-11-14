// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

/**
 * @class BuildingReqTechsApiClient
 * @description BuildingReqTechsApiClient
 */
export class BuildingReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.buildingRequirement, "buildingId", "buildingReqId");
  }
}

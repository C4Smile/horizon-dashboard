// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tech } from "../models/tech/Tech";

/**
 * @class TechReqBuildingsApiClient
 * @description TechReqBuildingsApiClient
 */
export class TechReqBuildingsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Tech.buildingRequirement, "techId", "buildingReqId");
  }
}

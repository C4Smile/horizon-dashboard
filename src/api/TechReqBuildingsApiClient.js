// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
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

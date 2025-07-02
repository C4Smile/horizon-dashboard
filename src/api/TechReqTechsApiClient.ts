// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tech } from "../lib/models/tech/Tech";

/**
 * @class TechReqTechsApiClient
 * @description TechReqTechsApiClient
 */
export class TechReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Tech.techRequirement, "techId", "techReqId");
  }
}

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Tech } from "../models/tech/Tech";

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

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tech } from "../models/tech/Tech";

/**
 * @class TechCostsApiClient
 * @description TechCostsApiClient
 */
export class TechCostsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Tech.costs, "techId", "resourceId");
  }
}

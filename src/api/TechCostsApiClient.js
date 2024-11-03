// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
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

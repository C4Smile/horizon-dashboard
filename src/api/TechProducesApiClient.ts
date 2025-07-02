// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tech } from "../lib/models/tech/Tech";

/**
 * @class TechProducesApiClient
 * @description TechProducesApiClient
 */
export class TechProducesApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Tech.resourceUpgrade, "techId", "resourceId");
  }
}

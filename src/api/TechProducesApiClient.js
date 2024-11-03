// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Tech } from "../models/tech/Tech";

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

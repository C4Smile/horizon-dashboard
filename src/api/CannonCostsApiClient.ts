// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Cannon } from "../lib/models/cannon/Cannon";

/**
 * @class CannonCostsApiClient
 * @description CannonCostsApiClient
 */
export class CannonCostsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Cannon.costs, "cannonId", "resourceId");
  }
}

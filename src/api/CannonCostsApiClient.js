// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Cannon } from "../models/cannon/Cannon";

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

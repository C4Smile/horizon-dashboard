// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";
import { Building } from "../models/building/Building";

/**
 * @class ShipReqTechsApiClient
 * @description ShipReqTechsApiClient
 */
export class ShipReqTechsApiClient extends BaseManyApiClient {
  /**
   * constructor
   */
  constructor() {
    super(Building.techRequirement, "shipId", "buildingReqId");
  }
}

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import { ShipCostDto, ShipCostAddDto, ShipCostFilterDto } from "lib";

/**
 * @class ShipCostsApiClient
 * @description ShipCostsApiClient
 */
export class ShipCostsApiClient extends BaseManyApiClient<
  ShipCostDto,
  ShipCostAddDto,
  ShipCostFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.ShipCosts);
  }
}

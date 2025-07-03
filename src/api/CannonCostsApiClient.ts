// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import { CannonCostDto, CannonCostAddDto, CannonCostFilterDto } from "lib";

/**
 * @class CannonCostsApiClient
 * @description CannonCostsApiClient
 */
export class CannonCostsApiClient extends BaseManyApiClient<
  CannonCostDto,
  CannonCostAddDto,
  CannonCostFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.CannonCosts);
  }
}

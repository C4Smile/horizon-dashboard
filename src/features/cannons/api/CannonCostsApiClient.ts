// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { CannonCostDto, CannonCostAddDto, CannonCostFilterDto } from "../lib";

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

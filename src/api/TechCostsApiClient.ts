// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import { TechCostDto, TechCostAddDto, TechCostFilterDto } from "lib";

/**
 * @class TechCostsApiClient
 * @description TechCostsApiClient
 */
export class TechCostsApiClient extends BaseManyApiClient<
  TechCostDto,
  TechCostAddDto,
  TechCostFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.TechCosts);
  }
}

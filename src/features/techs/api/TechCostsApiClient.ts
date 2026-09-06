// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { TechCostDto, TechCostAddDto, TechCostFilterDto } from "../lib";

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

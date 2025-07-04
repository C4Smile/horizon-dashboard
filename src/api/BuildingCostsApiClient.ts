// base
import { BaseManyApiClient } from "./utils";

// types
import { Tables } from "./types";

// lib
import {
  BuildingCostAddDto,
  BuildingCostDto,
  BuildingCostFilterDto,
} from "lib";

/**
 * @class BuildingCostsApiClient
 * @description BuildingCostsApiClient
 */
export class BuildingCostsApiClient extends BaseManyApiClient<
  BuildingCostDto,
  BuildingCostAddDto,
  BuildingCostFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.BuildingCosts);
  }
}

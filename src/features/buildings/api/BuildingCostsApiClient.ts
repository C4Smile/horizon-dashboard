// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { BuildingCostAddDto, BuildingCostDto, BuildingCostFilterDto } from "../lib";

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

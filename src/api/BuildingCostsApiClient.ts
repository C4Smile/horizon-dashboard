// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Building } from "../lib/models/building/Building";

// lib
import { BuildingCostDto, BuildingCostFilterDto } from "lib";

/**
 * @class BuildingCostsApiClient
 * @description BuildingCostsApiClient
 */
export class BuildingCostsApiClient extends BaseManyApiClient<
  BuildingCostDto,
  AddBuildingCostDto,
  BuildingCostFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Building.costs, "buildingId", "resourceId");
  }
}

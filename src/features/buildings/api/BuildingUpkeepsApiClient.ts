// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  BuildingUpkeepDto,
  BuildingUpkeepAddDto,
  BuildingUpkeepFilterDto,
} from "../lib";

/**
 * @class BuildingUpkeepsApiClient
 * @description BuildingUpkeepsApiClient
 */
export class BuildingUpkeepsApiClient extends BaseManyApiClient<
  BuildingUpkeepDto,
  BuildingUpkeepAddDto,
  BuildingUpkeepFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.BuildingUpkeeps);
  }
}

// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import {
  BuildingUpkeepDto,
  BuildingUpkeepAddDto,
  BuildingUpkeepFilterDto,
} from "lib";

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

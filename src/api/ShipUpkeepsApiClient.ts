// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient.js";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import { ShipUpkeepDto, ShipUpkeepAddDto, ShipUpkeepFilterDto } from "lib";

/**
 * @class ShipUpkeepsApiClient
 * @description ShipUpkeepsApiClient
 */
export class ShipUpkeepsApiClient extends BaseManyApiClient<
  ShipUpkeepDto,
  ShipUpkeepAddDto,
  ShipUpkeepFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.ShipUpkeeps);
  }
}

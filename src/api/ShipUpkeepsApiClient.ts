// base
import { BaseManyApiClient } from "./utils/";

// types
import { Tables } from "./types/";

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

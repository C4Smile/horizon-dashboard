// base
import { BaseManyApiClient } from "./utils/";

// types
import { Tables } from "./types";

// lib
import {
  BuildingProduceDto,
  BuildingProduceAddDto,
  BuildingProduceFilterDto,
} from "lib";

/**
 * @class BuildingProducesApiClient
 * @description BuildingProducesApiClient
 */
export class BuildingProducesApiClient extends BaseManyApiClient<
  BuildingProduceDto,
  BuildingProduceAddDto,
  BuildingProduceFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.BuildingProduces);
  }
}

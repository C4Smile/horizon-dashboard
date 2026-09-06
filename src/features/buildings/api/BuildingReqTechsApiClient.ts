// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  BuildingReqTechDto,
  BuildingReqTechAddDto,
  BuildingReqTechFilterDto,
} from "../lib";

/**
 * @class BuildingReqTechsApiClient
 * @description BuildingReqTechsApiClient
 */
export class BuildingReqTechsApiClient extends BaseManyApiClient<
  BuildingReqTechDto,
  BuildingReqTechAddDto,
  BuildingReqTechFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.BuildingReqTechs);
  }
}

// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  CannonReqTechAddDto,
  CannonReqTechDto,
  CannonReqTechFilterDto,
} from "../lib";

/**
 * @class CannonReqTechsApiClient
 * @description CannonReqTechsApiClient
 */
export class CannonReqTechsApiClient extends BaseManyApiClient<
  CannonReqTechDto,
  CannonReqTechAddDto,
  CannonReqTechFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.CannonReqTechs);
  }
}

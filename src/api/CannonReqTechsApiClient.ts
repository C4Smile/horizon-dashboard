// base
import { BaseManyApiClient } from "./utils/";

// types
import { Tables } from "./types/";

// lib
import { CannonReqTechAddDto, CannonReqTechDto, CannonReqTechFilterDto } from "lib";

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

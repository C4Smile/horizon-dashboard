// base
import { BaseManyApiClient } from "./utils/BaseManyApiClient";

// types
import { Tables } from "./types";

// lib
import { TechReqTechDto, TechReqTechAddDto, TechReqTechFilterDto } from "lib";

/**
 * @class TechReqTechsApiClient
 * @description TechReqTechsApiClient
 */
export class TechReqTechsApiClient extends BaseManyApiClient<
  TechReqTechDto,
  TechReqTechAddDto,
  TechReqTechFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.TechReqTechs);
  }
}

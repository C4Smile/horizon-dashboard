// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import {
  TechReqTechDto,
  TechReqTechAddDto,
  TechReqTechFilterDto,
} from "../lib";

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

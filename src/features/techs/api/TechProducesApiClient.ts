// base
import { BaseManyApiClient } from "api/utils";

// types
import { Tables } from "api/types";

// lib
import { TechProduceDto, TechProduceAddDto, TechProduceFilterDto } from "../lib";

/**
 * @class TechProducesApiClient
 * @description TechProducesApiClient
 */
export class TechProducesApiClient extends BaseManyApiClient<
  TechProduceDto,
  TechProduceAddDto,
  TechProduceFilterDto
> {
  /**
   * constructor
   */
  constructor() {
    super(Tables.TechProduces);
  }
}

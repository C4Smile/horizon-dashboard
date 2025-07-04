// base
import { BaseManyApiClient } from "./utils/";

// types
import { Tables } from "./types";

// lib
import { TechProduceDto, TechProduceAddDto, TechProduceFilterDto } from "lib";

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

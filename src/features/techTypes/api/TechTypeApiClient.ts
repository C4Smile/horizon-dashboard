// base
import { BaseApiClient } from "api/utils";
import { parseNumber } from "api/utils/formToDto";

// type
import { Tables } from "api/types/dbUtils";

// lib
import { FormValues } from "lib";
import {
  TechTypeAddDto,
  TechTypeCommonDto,
  TechTypeDto,
  TechTypeFilterDto,
  TechTypeUpdateDto,
} from "../lib";

/**
 * @class TechTypeApiClient
 * @description TechTypeApiClient
 */
export class TechTypeApiClient extends BaseApiClient<
  TechTypeDto,
  TechTypeCommonDto,
  TechTypeAddDto,
  TechTypeUpdateDto,
  TechTypeFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.TechTypes);
  }

  /**
   * @description Maps the form values to what the api stores
   * @param techType - form values
   * @returns techType dto
   */
  private toDto(techType: FormValues<TechTypeDto>) {
    return {
      name: techType.name ?? "",
    };
  }

  /**
   * @description Create techType
   * @param techType - TechType
   * @returns Transaction status
   */
  async createFromForm(techType: FormValues<TechTypeDto>) {
    return await this.saveNew(this.toDto(techType));
  }

  /**
   * @description Update techType
   * @param techType - TechType
   * @returns Transaction status
   */
  async updateFromForm(techType: FormValues<TechTypeDto>) {
    return await this.saveExisting({
      id: parseNumber(techType.id),
      ...this.toDto(techType),
    });
  }
}

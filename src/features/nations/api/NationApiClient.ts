// base
import { BaseApiClient } from "api/utils";
import { parseHtml, parseNumber } from "api/utils/formToDto";

// types
import { Tables } from "api/types";

// lib
import {
  NationAddDto,
  NationCommonDto,
  NationDto,
  NationFilterDto,
  NationUpdateDto,
} from "../lib";
import { FormValues } from "lib";

/**
 * @class NationApiClient
 * @description NationApiClient
 */
export class NationApiClient extends BaseApiClient<
  NationDto,
  NationCommonDto,
  NationAddDto,
  NationUpdateDto,
  NationFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.Nations);
  }

  /**
   * @description Maps the form values to what the api stores
   * @param nation - form values
   * @returns nation dto
   */
  private toDto(nation: FormValues<NationDto>) {
    return {
      name: nation.name ?? "",
      description: parseHtml(nation.description),
      playable: !!nation.playable,
    };
  }

  /**
   * @description Create nation
   * @param nation - Nation
   * @returns Transaction status
   */
  async createFromForm(nation: FormValues<NationDto>) {
    return await this.saveNew(this.toDto(nation));
  }

  /**
   * @description Update nation
   * @param nation - Nation
   * @returns Transaction status
   */
  async updateFromForm(nation: FormValues<NationDto>) {
    return await this.saveExisting({
      id: parseNumber(nation.id),
      ...this.toDto(nation),
    });
  }
}

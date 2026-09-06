
// base
import { BaseApiClient } from "api/utils";
import { FormPhoto, parseImage, parseNumber } from "api/utils/formToDto";

// type
import { Tables } from "api/types/dbUtils";

// lib
import { FormValues } from "lib";
import { TechTypeAddDto, TechTypeCommonDto, TechTypeDto, TechTypeFilterDto, TechTypeUpdateDto } from "../lib";

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
   * @param photo - ImageUploader state
   * @returns techType dto
   */
  private toDto(techType: FormValues<TechTypeDto>, photo: FormPhoto) {
    return {
      name: techType.name ?? "",
      ...parseImage(photo),
    };
  }

  /**
   * @description Create techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async createFromForm(techType: FormValues<TechTypeDto>, photo: FormPhoto) {
    return await this.saveNew(this.toDto(techType, photo));
  }

  /**
   * @description Update techType
   * @param techType - TechType
   * @param photo - Photo
   * @returns Transaction status
   */
  async updateFromForm(techType: FormValues<TechTypeDto>, photo: FormPhoto) {
    return await this.saveExisting({
      id: parseNumber(techType.id),
      ...this.toDto(techType, photo),
    });
  }
}

// base
import { BaseApiClient } from "api/utils";
import {
  FormPhoto,
  parseHtml,
  parseIcon,
  parseImage,
  parseNumber,
} from "api/utils/formToDto";

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
   * @param photo - ImageUploader state for the flag
   * @param icon - ImageUploader state for the icon
   * @returns nation dto
   */
  private toDto(
    nation: FormValues<NationDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return {
      name: nation.name ?? "",
      ...parseImage(photo),
      ...parseIcon(icon),
      description: parseHtml(nation.description),
      playable: !!nation.playable,
    };
  }

  /**
   * @description Create nation
   * @param nation - Nation
   * @param photo - Flag
   * @param icon - Icon
   * @returns Transaction status
   */
  async createFromForm(
    nation: FormValues<NationDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return await this.saveNew(this.toDto(nation, photo, icon));
  }

  /**
   * @description Update nation
   * @param nation - Nation
   * @param photo - Flag
   * @param icon - Icon
   * @returns Transaction status
   */
  async updateFromForm(
    nation: FormValues<NationDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return await this.saveExisting({
      id: parseNumber(nation.id),
      ...this.toDto(nation, photo, icon),
    });
  }
}

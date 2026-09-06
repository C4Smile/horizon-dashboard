// base
import { BaseApiClient } from "api/utils/BaseApiClient";
import {
  FormPhoto,
  parseHtml,
  parseIcon,
  parseImage,
  parseNumber,
} from "api/utils/formToDto";

// types
import { Tables } from "api/types/dbUtils";

// lib
import { FormValues } from "lib";
import {
  ResourceAddDto,
  ResourceCommonDto,
  ResourceDto,
  ResourceFilterDto,
  ResourceUpdateDto,
} from "../lib";

/**
 * @class ResourceApiClient
 * @description ResourceApiClient
 */
export class ResourceApiClient extends BaseApiClient<
  ResourceDto,
  ResourceCommonDto,
  ResourceAddDto,
  ResourceUpdateDto,
  ResourceFilterDto
> {
  /**
   * create base api client
   */
  constructor() {
    super(Tables.Resources);
  }

  /**
   * @description Maps the form values to what the api stores
   * @param resource - form values
   * @param photo - ImageUploader state
   * @param icon - icon ImageUploader state
   * @returns resource dto
   */
  private toDto(
    resource: FormValues<ResourceDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return {
      name: resource.name ?? "",
      baseFactor: parseNumber(resource.baseFactor),
      description: parseHtml(resource.description),
      ...parseImage(photo),
      ...parseIcon(icon),
    };
  }

  /**
   * @description Create resource
   * @param resource - Resource
   * @param photo - Photo
   * @param icon - Icon
   * @returns Transaction status
   */
  async createFromForm(
    resource: FormValues<ResourceDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return await this.saveNew(this.toDto(resource, photo, icon));
  }

  /**
   * @description Update resource
   * @param resource - Resource
   * @param photo - photo
   * @param icon - icon
   * @returns Transaction status
   */
  async updateFromForm(
    resource: FormValues<ResourceDto>,
    photo: FormPhoto,
    icon: FormPhoto,
  ) {
    return await this.saveExisting({
      id: parseNumber(resource.id),
      ...this.toDto(resource, photo, icon),
    });
  }
}

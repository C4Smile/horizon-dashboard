import { toSlug } from "some-javascript-utils";

// base
import { BaseApiClient } from "./utils/BaseApiClient";
import {
  FormPhoto,
  parseHtml,
  parseImage,
  parseNumber,
} from "./utils/formToDto";

// types
import { Tables } from "./types/dbUtils.js";

// lib
import {
  ResourceDto,
  ResourceCommonDto,
  ResourceAddDto,
  ResourceUpdateDto,
  ResourceFilterDto,
} from "lib";

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
   * @returns resource dto
   */
  private toDto(resource: ResourceDto, photo: FormPhoto) {
    return {
      name: resource.name,
      urlName: toSlug(resource.name),
      baseFactor: parseNumber(resource.baseFactor),
      description: parseHtml(resource.description),
      ...parseImage(photo),
    };
  }

  /**
   * @description Create resource
   * @param resource - Resource
   * @param photo - Photo
   * @returns Transaction status
   */
  async create(resource: ResourceDto, photo: FormPhoto) {
    return await this.saveNew(this.toDto(resource, photo) as ResourceAddDto);
  }

  /**
   * @description Update resource
   * @param resource - Resource
   * @param photo - photo
   * @returns Transaction status
   */
  async update(resource: ResourceDto, photo: FormPhoto) {
    return await this.saveExisting({
      id: resource.id,
      ...this.toDto(resource, photo),
    } as ResourceUpdateDto);
  }
}

import { toSlug } from "some-javascript-utils";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { ImagesResourceApiClient } from "./ImagesResourceApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class ResourceApiClient
 * @description ResourceApiClient
 */
export class ResourceApiClient extends BaseApiClient {
  photosResource = new ImagesResourceApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "resource";
  }

  /**
   * @description Create resource
   * @param {object} resource - Resource
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async create(resource, photos) {
    // default values
    resource.urlName = toSlug(resource.title);
    // call service
    const { error, data, status } = await makeRequest("resources", "POST", resource, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosResource.create({
          resourceId: data[0].id,
          imageId: photo.id,
          alt: resource.title,
        });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update resource
   * @param {object} resource - Resource
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async update(resource, photos) {
    // default values
    resource.urlName = toSlug(resource.title);
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = resource.resourceHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // cleaning relation ships
    delete resource.tagsId;
    delete resource.resourceHasTag;
    delete resource.resourceHasImage;
    // call service
    const { status, error } = await makeRequest(
      `resources/${resource.id}`,
      "PATCH",
      {
        ...resource,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosResource.create({
          resourceId: resource.id,
          imageId: newPhoto.id,
          alt: resource.title,
        });

    return { error, status: status === 204 ? 201 : status };
  }
}

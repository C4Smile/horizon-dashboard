import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { ImagesBuildingApiClient } from "./ImagesBuildingApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class BuildingApiClient
 * @description BuildingApiClient
 */
export class BuildingApiClient extends BaseApiClient {
  photosBuilding = new ImagesBuildingApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "building";
  }

  /**
   * @description Create building
   * @param {object} building - Building
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async create(building, photos) {
    // default values
    building.urlName = toSlug(building.title);
    // parsing html
    building.content = draftToHtml(convertToRaw(building.content.getCurrentContent()));
    // cleaning relation ships
    delete building.tagsId;
    // call service
    const { error, data, status } = await makeRequest("buildings", "POST", building, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosBuilding.create({
          buildingId: data[0].id,
          imageId: photo.id,
          alt: building.title,
        });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update building
   * @param {object} building - Building
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async update(building, photos) {
    // default values
    building.urlName = toSlug(building.title);
    // parsing html
    building.content = draftToHtml(convertToRaw(building.content.getCurrentContent()));
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = building.buildingHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // cleaning relation ships
    delete building.tagsId;
    delete building.buildingHasTag;
    delete building.buildingHasImage;
    // call service
    const { status, error } = await makeRequest(
      `buildings/${building.id}`,
      "PATCH",
      {
        ...building,
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
        this.photosBuilding.create({
          buildingId: building.id,
          imageId: newPhoto.id,
          alt: building.title,
        });

    return { error, status: status === 204 ? 201 : status };
  }
}

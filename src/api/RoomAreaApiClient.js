import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { RoomArea } from "../models/roomArea/RoomArea";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// apis
import { ImagesRoomAreasApiClient } from "./ImagesRoomAreasApiClient";
import { Images360RoomAreasApiClient } from "./Images360RoomAreasApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class RoomAreaApiClient
 * @description RoomAreaApiClient
 */
export class RoomAreaApiClient extends BaseApiClient {
  photosRoomAreas = new ImagesRoomAreasApiClient();
  photos360RoomAreas = new Images360RoomAreasApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "roomArea";
  }

  /**
   * @description Get all roomArea
   * @param {number} roomId Room Id
   * @returns {Promise<RoomArea[]>} RoomAreas
   */
  async getByRoomId(roomId) {
    const { error, data, status } = await makeRequest(`${this.baseUrl}/byRoomId/${roomId}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Create roomArea
   * @param {object} roomArea - RoomArea
   * @param {object[]} photos - RoomArea photos
   * @param {object} photos360 - RoomArea 360 photos
   * @returns {Promise<RoomArea>} RoomArea
   */
  async create(roomArea, photos, photos360) {
    // parsing html
    roomArea.content = roomArea.content
      ? draftToHtml(convertToRaw(roomArea.content.getCurrentContent()))
      : "";
    // parsing room
    roomArea.roomId = roomArea.roomId.id;
    // call service
    const { error, data, status } = await makeRequest(
      this.baseUrl,
      "POST",
      { ...roomArea, statusId: 1 },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // adding relationships
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosRoomAreas.create({
          roomAreaId: data[0].id,
          imageId: photo.id,
          alt: roomArea.name,
        });
    // saving image360
    if (photos360)
      for (const photo of photos360)
        await this.photos360RoomAreas.create({
          roomAreaId: data[0].id,
          imageId: photo.id,
          alt: roomArea.name,
        });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * Save room areas order
   * @param {object} roomAreas - selected room areas
   * @returns if error occurred
   */
  async saveOrder(roomAreas) {
    const { error } = await makeRequest(`${this.baseUrl}/order`, "PUT", roomAreas, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    return error;
  }

  /**
   * @description Update roomArea
   * @param {object} roomArea - RoomArea
   * @param {object[]} photos - RoomArea photos
   * @param {object} photos360 - RoomArea 360 photos
   * @returns {Promise<RoomArea>} RoomArea
   */
  async update(roomArea, photos, photos360) {
    // parsing html
    roomArea.content = roomArea.content
      ? draftToHtml(convertToRaw(roomArea.content.getCurrentContent()))
      : "";
    // parsing room
    roomArea.roomId = roomArea.roomId.id;
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = roomArea.roomAreaHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // saving photos
    const newPhotos360 = [];
    for (const newPhoto of photos360) {
      const found = roomArea.roomAreaHasImage360.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos360.push(newPhoto);
    }
    // cleaning relation ships
    delete roomArea.roomAreaHasImage;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${roomArea.id}`,
      "PATCH",
      {
        ...roomArea,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // do relationship updates
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosRoomAreas.create({
          roomAreaId: roomArea.id,
          imageId: newPhoto.id,
          alt: roomArea.name,
        });

    // saving photo
    if (newPhotos360.length)
      for (const newPhoto of newPhotos360)
        this.photos360RoomAreas.create({
          roomAreaId: roomArea.id,
          imageId: newPhoto.id,
          alt: roomArea.name,
        });
    return { error, status: status === 204 ? 201 : status };
  }
}

import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { Room } from "../models/room/Room";

// services
import { makeRequest } from "../db/services";

// utils
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// apis
import { ImagesRoomsApiClient } from "./ImagesRoomsApiClient";
import { Images360RoomsApiClient } from "./Images360RoomsApiClient";
import { RoomSchedulesApiClient } from "./RoomSchedulesApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient extends BaseApiClient {
  photosRooms = new ImagesRoomsApiClient();
  photos360Rooms = new Images360RoomsApiClient();
  roomSchedules = new RoomSchedulesApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "room";
  }

  /**
   * @description Group by room type
   * @returns text
   */
  async getCurrentContent() {
    return "";
  }

  /**
   * @description Create room
   * @param {object} room - Room
   * @param {object[]} photos - Room photos
   * @param {object} photos360 - Room 360 photos
   * @returns {Promise<Room>} Room
   */
  async create(room, photos, photos360) {
    // default values
    room.urlName = toSlug(room.name);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : "";
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", room.newRoomHasSchedules, room.roomHasSchedules);
    // cleaning relation ships
    delete room.newRoomHasSchedules;
    // call service
    const { error, data, status } = await makeRequest(
      this.baseUrl,
      "POST",
      { ...room, statusId: 1 },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // adding relationships
    // saving schedule
    for (const schedule of scheduleToKeep)
      await this.roomSchedules.create({
        roomId: data[0].id,
        description: schedule.description,
        date: schedule.date,
      });
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosRooms.create({
          roomId: data[0].id,
          imageId: photo.id,
          alt: room.name,
        });
    // saving image360
    if (photos360)
      for (const photo of photos360)
        await this.photos360Rooms.create({ roomId: data[0].id, imageId: photo.id, alt: room.name });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update room
   * @param {object} room - Room
   * @param {object[]} photos - Room photos
   * @param {object} photos360 - Room 360 photos
   * @returns {Promise<Room>} Room
   */
  async update(room, photos, photos360) {
    // default values
    room.urlName = toSlug(room.name);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : "";
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", room.newRoomHasSchedules, room.roomHasSchedules);
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = room.roomHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // saving photos
    const newPhotos360 = [];
    for (const newPhoto of photos360) {
      const found = room.roomHasImage360.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos360.push(newPhoto);
    }
    // cleaning relation ships
    delete room.roomHasImage;
    delete room.roomHasSchedules;
    delete room.newRoomHasSchedules;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${room.id}`,
      "PATCH",
      {
        ...room,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // do relationship updates
    // saving schedule
    for (const schedule of scheduleToKeep) {
      if (schedule.delete) await this.roomSchedules.deleteSingle(schedule.id);
      await this.roomSchedules.create({
        roomId: room.id,
        description: schedule.description,
        date: schedule.date,
      });
    }
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosRooms.create({ roomId: room.id, imageId: newPhoto.id, alt: room.name });

    // saving photo
    if (newPhotos360.length)
      for (const newPhoto of newPhotos360)
        this.photos360Rooms.create({ roomId: room.id, imageId: newPhoto.id, alt: room.name });
    return { error, status: status === 204 ? 201 : status };
  }
}

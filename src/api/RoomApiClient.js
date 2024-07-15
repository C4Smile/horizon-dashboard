import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { Room } from "../models/room/Room";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { parseManyToMany } from "./utils/relationships";

// apis
import { ImagesRoomsApiClient } from "./ImagesRoomsApiClient";
import { Images360RoomsApiClient } from "./Images360RoomsApiClient";
import { RoomSchedulesApiClient } from "./RoomSchedulesApiClient";
import { RoomLinksApiClient } from "./RoomLinksApiClient";

/**
 * @class RoomApiClient
 * @description RoomApiClient
 */
export class RoomApiClient {
  photosRooms = new ImagesRoomsApiClient();
  photos360Rooms = new Images360RoomsApiClient();
  roomSchedules = new RoomSchedulesApiClient();
  roomLinks = new RoomLinksApiClient();

  /**
   * @description Get all room
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<Room[]>} Rooms
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`room?sort=${sort}&order=${order}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data;
  }

  /**
   * @description Get room by id
   * @param {string} id - Room id
   * @returns {Promise<Room>} Room
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`room/${id}`);
    if (error !== null) return { status, statusCode: status, message: error.message };
    return data[0];
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
    room.urlName = toSlug(room.title);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : null;
    // parsing links
    const linksToKeep = parseManyToMany("linkId", room.newRoomHasLink, room.roomHasLink);
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", room.newRoomHasSchedules, room.roomHasSchedules);
    // parsing tags
    const tagsToKeep = room.tagsId.map((tag) => tag.id);
    // cleaning relation ships
    delete room.tagsId;
    delete room.newRoomHasLink;
    delete room.newRoomHasSchedules;
    // call service
    const { error, data, status } = await makeRequest("room", "POST", room);
    if (error !== null) return { status, data, statusCode: status, message: error.message };
    // adding relationships
    // saving links
    for (const link of linksToKeep)
      await this.roomLinks.create({ roomId: data[0].id, linkId: link.linkId, url: link.url });

    // saving schedule
    for (const schedule of scheduleToKeep)
      await this.roomSchedules.create({
        roomId: data[0].id,
        description: schedule.description,
        date: schedule.date,
      });
    // saving tags
    for (const tag of tagsToKeep) await this.tagsRooms.create({ roomId: data[0].id, tagId: tag });
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosRooms.create({ roomId: data[0].id, imageId: photo.id });
    // saving image360
    if (photos360)
      for (const photo of photos360)
        await this.photos360Rooms.create({ roomId: data[0].id, imageId: photo.id });

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
    room.urlName = toSlug(room.title);
    // parsing html
    room.content = room.content ? draftToHtml(convertToRaw(room.content.getCurrentContent())) : null;
    // parsing links
    const linksToKeep = parseManyToMany("linkId", room.newRoomHasLink, room.roomHasLink);
    // parsing schedule
    const scheduleToKeep = parseManyToMany("id", room.newRoomHasSchedules, room.roomHasSchedules);
    // parsing tags
    const tagsToKeep = parseManyToMany("typeId", room.tagsId, room.roomHasTag);
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
    delete room.tagsId;
    delete room.roomHasTag;
    delete room.roomHasImage;
    delete room.newRoomHasLink;
    delete room.roomHasLink;
    delete room.roomHasSchedules;
    delete room.newRoomHasSchedules;
    // call service
    const { status, error } = await makeRequest(`room/${room.id}`, "PUT", {
      ...room,
      lastUpdate: new Date().toISOString(),
    });
    if (error !== null) return { status, statusCode: error.code, message: error.message };
    // do relationship updates
    // saving links
    for (const link of linksToKeep) {
      if (link.delete) await this.roomSchedules.deleteByUrl(link.linkId, link.url);
      else await this.roomLinks.create({ roomId: room.id, linkId: link.linkId, url: link.url });
    }
    // saving schedule
    for (const schedule of scheduleToKeep) {
      if (schedule.delete) await this.roomSchedules.deleteSingle(schedule.id);
      await this.roomSchedules.create({
        roomId: room.id,
        description: schedule.description,
        date: schedule.date,
      });
    }
    // saving tags
    for (const tag of tagsToKeep) {
      if (tag.delete) this.tagsRooms.deleteByRoom(tag.tagId, room.id);
      else this.tagsRooms.create({ roomId: room.id, tagId: tag.tagId });
    }
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosRooms.create({ roomId: room.id, imageId: newPhoto.id });

    // saving photo
    if (newPhotos360.length)
      for (const newPhoto of newPhotos360)
        this.photos360Rooms.create({ roomId: room.id, imageId: newPhoto.id });
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids) await makeRequest(`room/${id}`, "DELETE");
    return { status: 204 };
  }
}

import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { GuestBook } from "../models/guestBook/GuestBook";

// services
import { makeRequest } from "../db/services";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// apis
import { ImagesGuestBooksApiClient } from "./ImagesGuestBooksApiClient";
import { Images360GuestBooksApiClient } from "./Images360GuestBooksApiClient";

/**
 * @class GuestBookApiClient
 * @description GuestBookApiClient
 */
export class GuestBookApiClient {
  photosGuestBooks = new ImagesGuestBooksApiClient();
  photos360GuestBooks = new Images360GuestBooksApiClient();

  /**
   * @description Get all guestBook
   * @param {string} sort attribute to order by
   * @param {string} order asc/desc
   * @returns {Promise<GuestBook[]>} GuestBooks
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`guestBook?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get guestBook by id
   * @param {string} id - GuestBook id
   * @returns {Promise<GuestBook>} GuestBook
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`guestBook/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create guestBook
   * @param {object} guestBook - GuestBook
   * @param {object[]} photos - GuestBook photos
   * @param {object} photos360 - GuestBook 360 photos
   * @returns {Promise<GuestBook>} GuestBook
   */
  async create(guestBook, photos, photos360) {
    // parsing html
    guestBook.content = guestBook.content
      ? draftToHtml(convertToRaw(guestBook.content.getCurrentContent()))
      : "";
    // parsing room
    guestBook.roomId = guestBook.roomId.id;
    // call service
    const { error, data, status } = await makeRequest(
      "guestBook",
      "POST",
      { ...guestBook, statusId: 1 },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };
    // adding relationships
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosGuestBooks.create({ guestBookId: data[0].id, imageId: photo.id });
    // saving image360
    if (photos360)
      for (const photo of photos360)
        await this.photos360GuestBooks.create({ guestBookId: data[0].id, imageId: photo.id });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update guestBook
   * @param {object} guestBook - GuestBook
   * @param {object[]} photos - GuestBook photos
   * @param {object} photos360 - GuestBook 360 photos
   * @returns {Promise<GuestBook>} GuestBook
   */
  async update(guestBook, photos, photos360) {
    // parsing html
    guestBook.content = guestBook.content
      ? draftToHtml(convertToRaw(guestBook.content.getCurrentContent()))
      : "";
    // parsing room
    guestBook.roomId = guestBook.roomId.id;
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = guestBook.guestBookHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // saving photos
    const newPhotos360 = [];
    for (const newPhoto of photos360) {
      const found = guestBook.guestBookHasImage360.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos360.push(newPhoto);
    }
    // cleaning relation ships
    delete guestBook.guestBookHasImage;
    // call service
    const { status, error } = await makeRequest(
      `guestBook/${guestBook.id}`,
      "PATCH",
      {
        ...guestBook,
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
        this.photosGuestBooks.create({ guestBookId: guestBook.id, imageId: newPhoto.id });

    // saving photo
    if (newPhotos360.length)
      for (const newPhoto of newPhotos360)
        this.photos360GuestBooks.create({ guestBookId: guestBook.id, imageId: newPhoto.id });
    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`guestBook/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });
    return { status: 204 };
  }
}

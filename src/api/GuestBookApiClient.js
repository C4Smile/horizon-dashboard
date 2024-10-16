import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// entity
import { GuestBook } from "../models/guestBook/GuestBook";

// services
import { makeRequest } from "../db/services";

// utils
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// apis
import { ImagesGuestBooksApiClient } from "./ImagesGuestBooksApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class GuestBookApiClient
 * @description GuestBookApiClient
 */
export class GuestBookApiClient extends BaseApiClient {
  photosGuestBooks = new ImagesGuestBooksApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "guestBook";
  }

  /**
   * @description Create guestBook
   * @param {object} guestBook - GuestBook
   * @param {object[]} photos - GuestBook photos
   * @returns {Promise<GuestBook>} GuestBook
   */
  async create(guestBook, photos) {
    // parsing html
    guestBook.content = guestBook.content
      ? draftToHtml(convertToRaw(guestBook.content.getCurrentContent()))
      : "";
    // call service
    const { error, data, status } = await makeRequest(
      this.baseUrl,
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
        await this.photosGuestBooks.create({
          guestBookId: data[0].id,
          imageId: photo.id,
          alt: guestBook.name,
        });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update guestBook
   * @param {object} guestBook - GuestBook
   * @param {object[]} photos - GuestBook photos
   * @returns {Promise<GuestBook>} GuestBook
   */
  async update(guestBook, photos) {
    // parsing html
    guestBook.content = guestBook.content
      ? draftToHtml(convertToRaw(guestBook.content.getCurrentContent()))
      : "";
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = guestBook.guestBookHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // cleaning relation ships
    delete guestBook.guestBookHasImage;
    // call service
    const { status, error } = await makeRequest(
      `${this.baseUrl}/${guestBook.id}`,
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
        this.photosGuestBooks.create({
          guestBookId: guestBook.id,
          imageId: newPhoto.id,
          alt: guestBook.name,
        });

    return { error, status: status === 204 ? 201 : status };
  }
}

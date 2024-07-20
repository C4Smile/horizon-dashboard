import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { SortOrder } from "../models/query/GenericFilter";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { TagsNewsApiClient } from "./TagsNewsApiClient";
import { ImagesNewsApiClient } from "./ImagesNewsApiClient";

/**
 * @class NewsApiClient
 * @description NewsApiClient
 */
export class NewsApiClient {
  tagsNews = new TagsNewsApiClient();
  photosNews = new ImagesNewsApiClient();

  // private scripts
  parseTags = (localTags = [], remoteTags = []) => {
    const toAdd = [];
    const toRemove = [];

    // adding new tags
    if (localTags)
      for (const localTag of localTags) {
        if (!remoteTags) {
          toAdd.push({ tagId: localTag.id, delete: false });
          continue;
        }
        const remoteTag = remoteTags.find((tag) => tag.tagId === localTag.id);
        if (!remoteTag) toAdd.push({ tagId: localTag.id, delete: false });
      }
    // removing tags
    if (remoteTags)
      for (const remoteTag of remoteTags) {
        if (!localTags) {
          toRemove.push({ tagId: remoteTag.tagId, delete: true });
          continue;
        }
        const localTag = localTags.find((tag) => tag.id === remoteTag.tagId);
        if (!localTag) toRemove.push({ tagId: remoteTag.tagId, delete: true });
      }
    return [...toAdd, ...toRemove];
  };

  /**
   * @description Get all news
   * @param {string} sort - Sort by
   * @param {SortOrder} order - Order ASC/DESC
   * @returns News list
   */
  async getAll(sort = "lastUpdate", order = SortOrder.ASC) {
    const { error, data, status } = await makeRequest(`news?sort=${sort}&order=${order}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data;
  }

  /**
   * @description Get news by id
   * @param {string} id - News id
   * @returns News by id
   */
  async getById(id) {
    const { error, data, status } = await makeRequest(`news/${id}`);
    if (error !== null) return { status, error: { message: error.message } };
    return data[0];
  }

  /**
   * @description Create news
   * @param {object} news - News
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async create(news, photos) {
    // default values
    news.urlName = toSlug(news.title);
    // parsing html
    news.content = draftToHtml(convertToRaw(news.content.getCurrentContent()));
    // parsing tags
    const tagsToKeep = news.tags.map((tag) => tag.id);
    // cleaning relation ships
    delete news.tagsId;
    // call service
    const { error, data, status } = await makeRequest("news", "POST", news, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    // adding relationships
    for (const tag of tagsToKeep) await this.tagsNews.create({ newsId: data[0].id, tagId: tag });
    // saving image
    if (photos)
      for (const photo of photos)
        await this.photosNews.create({ newsId: data[0].id, imageId: photo.id });

    return { error, data, status: status === 204 ? 201 : status };
  }

  /**
   * @description Update news
   * @param {object} news - News
   * @param {object[]} photos - Photos
   * @returns Transaction status
   */
  async update(news, photos) {
    // default values
    news.urlName = toSlug(news.title);
    // parsing html
    news.content = draftToHtml(convertToRaw(news.content.getCurrentContent()));
    // parsing tags
    const tagsToKeep = this.parseTags(news.tagsId, news.newsHasTag);
    // saving photos
    const newPhotos = [];
    for (const newPhoto of photos) {
      const found = news.newsHasImage.some((value) => value.imageId.id === newPhoto.id);
      if (!found) newPhotos.push(newPhoto);
    }
    // cleaning relation ships
    delete news.tagsId;
    delete news.newsHasTag;
    delete news.newsHasImage;
    // call service
    const { status, error } = await makeRequest(
      `news/${news.id}`,
      "PUT",
      {
        ...news,
        lastUpdate: new Date().toISOString(),
      },
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      },
    );
    if (error !== null) return { status, error: { message: error.message } };

    // adding relationships
    for (const tag of tagsToKeep) {
      if (tag.delete) this.tagsNews.deleteByNews(tag.tagId, news.id);
      else this.tagsNews.create({ newsId: news.id, tagId: tag.tagId });
    }
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosEvents.create({ newsId: news.id, imageId: newPhoto.id });

    return { error, status: status === 204 ? 201 : status };
  }

  /**
   * Remove elements by their id
   * @param {number[]} ids ids to delete
   * @returns Transaction status
   */
  async delete(ids) {
    for (const id of ids)
      await makeRequest(`news/${id}`, "DELETE", null, {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      });

    return { status: 204 };
  }
}

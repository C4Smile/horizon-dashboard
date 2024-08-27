import { toSlug } from "some-javascript-utils";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

// utils
import { parseManyToMany } from "./utils/relationships";
import { fromLocal } from "../utils/local";

// config
import config from "../config";

// services
import { makeRequest } from "../db/services";

// apis
import { TagsNewsApiClient } from "./TagsNewsApiClient";
import { ImagesNewsApiClient } from "./ImagesNewsApiClient";

// base
import { BaseApiClient } from "./utils/BaseApiClient";

/**
 * @class NewsApiClient
 * @description NewsApiClient
 */
export class NewsApiClient extends BaseApiClient {
  tagsNews = new TagsNewsApiClient();
  photosNews = new ImagesNewsApiClient();

  /**
   * create base api client
   */
  constructor() {
    super();
    this.baseUrl = "news";
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
    const tagsToKeep = news.tagsId.map((tag) => tag.id);
    // cleaning relation ships
    delete news.tagsId;
    // call service
    const { error, data, status } = await makeRequest("news", "POST", news, {
      Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
    });
    if (error !== null) return { status, error: { message: error.message } };

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
    const tagsToKeep = parseManyToMany("tagId", news.tagsId, news.newsHasTag);
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
      "PATCH",
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
      if (tag.delete) this.tagsNews.delete(tag.tagId, news.id);
      else this.tagsNews.create({ newsId: news.id, tagId: tag.tagId });
    }
    // saving photo
    if (newPhotos.length)
      for (const newPhoto of newPhotos)
        this.photosNews.create({ newsId: news.id, imageId: newPhoto.id });

    return { error, status: status === 204 ? 201 : status };
  }
}

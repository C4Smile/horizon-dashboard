import { RoomApiClient } from "./RoomApiClient";
import { UserApiClient } from "./UserApiClient";
import { NewsApiClient } from "./NewsApiClient";
import { TagApiClient } from "./TagApiClient";
import { EventApiClient } from "./EventApiClient";

/**
 * @class MuseumApiClient
 * @description MuseumApiClient
 */
export class MuseumApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.user = new UserApiClient();
    this.room = new RoomApiClient();
    this.tags = new TagApiClient();
    this.news = new NewsApiClient();
    this.events = new EventApiClient();
  }

  /**
   * @returns {UserApiClient} Customer
   */
  get User() {
    return this.user;
  }

  /**
   * @returns {RoomApiClient} Room
   */
  get Room() {
    return this.room;
  }

  /**
   * @returns {TagApiClient} Tag
   */
  get Tags() {
    return this.tags;
  }

  /**
   * @returns {NewsApiClient} News
   */
  get News() {
    return this.news;
  }
}

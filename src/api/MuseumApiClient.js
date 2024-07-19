import { ActivityApiClient } from "./ActivityApiClient";
import { AppTextApiClient } from "./AppTextApiClient";
import { EventApiClient } from "./EventApiClient";
import { ExternalLinkApiClient } from "./ExternalLinkApiClient";
import { NewsApiClient } from "./NewsApiClient";
import { PushNotificationApiClient } from "./PushNotificationApiClient";
import { RoleApiClient } from "./RoleApiClient";
import { RoomApiClient } from "./RoomApiClient";
import { RoomStatusApiClient } from "./RoomStatusApiClient";
import { RoomTypeApiClient } from "./RoomTypeApiClient";
import { ServiceApiClient } from "./ServiceApiClient";
import { TagApiClient } from "./TagApiClient";
import { UserApiClient } from "./UserApiClient";

/**
 * @class MuseumApiClient
 * @description MuseumApiClient
 */
export class MuseumApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.activity = new ActivityApiClient();
    this.appText = new AppTextApiClient();
    this.events = new EventApiClient();
    this.externalLink = new ExternalLinkApiClient();
    this.news = new NewsApiClient();
    this.pushNotifications = new PushNotificationApiClient();
    this.role = new RoleApiClient();
    this.room = new RoomApiClient();
    this.roomStatus = new RoomStatusApiClient();
    this.roomType = new RoomTypeApiClient();
    this.service = new ServiceApiClient();
    this.tags = new TagApiClient();
    this.user = new UserApiClient();
  }

  /**
   * @returns {ActivityApiClient} Activity
   */
  get Activity() {
    return this.activity;
  }

  /**
   * @returns {AppTextApiClient} AppText
   */
  get AppText() {
    return this.appText;
  }

  /**
   * @returns {EventApiClient} Events
   */
  get Events() {
    return this.events;
  }

  /**
   * @returns {NewsApiClient} News
   */
  get News() {
    return this.news;
  }

  /**
   * @returns {PushNotificationApiClient} PushNotification
   */
  get PushNotification() {
    return this.pushNotifications;
  }

  /**
   * @returns {RoleApiClient} Role
   */
  get Role() {
    return this.role;
  }

  /**
   * @returns {RoomApiClient} Room
   */
  get Room() {
    return this.room;
  }

  /**
   * @returns {RoomStatusApiClient} RoomStatus
   */
  get RoomStatus() {
    return this.roomStatus;
  }

  /**
   * @returns {RoomTypeApiClient} RoomType
   */
  get RoomType() {
    return this.roomType;
  }

  /**
   * @returns {ServiceApiClient} Service
   */
  get Service() {
    return this.service;
  }

  /**
   * @returns {TagApiClient} Tag
   */
  get Tag() {
    return this.tags;
  }

  /**
   * @returns {UserApiClient} Customer
   */
  get User() {
    return this.user;
  }

  /**
   * @returns {ExternalLinkApiClient} ExternalLink
   */
  get ExternalLink() {
    return this.externalLink;
  }
}

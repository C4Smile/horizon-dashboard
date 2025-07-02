// types
import { Entity } from "../entity/Entity";
import { Photo } from "../photo/Photo";

/**
 * @class PushNotification
 * @description Represents a pushNotification
 */
export class PushNotification extends Entity {
  title = "";
  action = "";
  image = {};
  sentDate: string;

  /**
   * @param id - PushNotification id
   * @param title - PushNotification title
   * @param action - PushNotification action
   * @param image - PushNotification image
   * @param sentDate - PushNotification sentDate
   * @param dateOfCreation - PushNotification date of creation
   * @param lastUpdate - PushNotification last update
   * @param deleted - PushNotification deleted
   */
  constructor(
    id: number,
    title: string,
    action: string,
    image: Photo,
    sentDate: string,
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.action = action;
    this.image = image;
    this.sentDate = sentDate;
    PushNotification.className = "pushNotification";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {PushNotification} Entity instance
   */
  static fromJson(json) {
    return new PushNotification(
      json.id,
      json.title,
      json.action,
      json.image,
      json.sentDate,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted
    );
  }
}

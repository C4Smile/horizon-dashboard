import { Entity } from "../entity/Entity";

/**
 * @class PushNotification
 * @description Represents a pushNotification
 */
export class PushNotification extends Entity {
  title = "";
  action = "";
  image = {};
  sentDate = null;

  /**
   * @param {number} id - PushNotification id
   * @param {string} title - PushNotification title
   * @param {string} action - PushNotification action
   * @param {object} image - PushNotification image
   * @param {Date} sentDate - PushNotification sentDate
   * @param {Date} dateOfCreation - PushNotification date of creation
   * @param {Date} lastUpdate - PushNotification last update
   * @param {boolean} deleted - PushNotification deleted
   */
  constructor(
    id,
    title,
    action,
    image,
    sentDate,
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false,
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
      json.deleted,
    );
  }
}

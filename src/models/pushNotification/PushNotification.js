import { Entity } from "../entity/Entity";

/**
 * @class PushNotification
 * @description Represents a pushNotification
 */
export class PushNotification extends Entity {
  title = "";
  action = "";
  imageId = 0;
  sentDate = null;

  /**
   * @param {number} id - PushNotification id
   * @param {string} title - PushNotification title
   * @param {string} action - PushNotification action
   * @param {number} imageId - PushNotification imageId
   * @param {Date} sentDate - PushNotification sentDate
   * @param {Date} dateOfCreation - PushNotification date of creation
   * @param {Date} lastUpdate - PushNotification last update
   * @param {boolean} deleted - PushNotification deleted
   */
  constructor(
    id,
    title,
    action,
    imageId,
    sentDate,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.action = action;
    this.imageId = imageId;
    this.sentDate = sentDate;
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
      json.imageId,
      json.sentDate,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Title
   */
  get Title() {
    return this.title;
  }
}

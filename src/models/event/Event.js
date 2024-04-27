import { Entity } from "../entity/Entity";

/**
 * @class Event
 * @description Represents a event
 */
export class Event extends Entity {
  title = "";

  /**
   * @param {number} id - Event id
   * @param {string} title - Event title
   * @param {Date} dateOfCreation - Event date of creation
   * @param {Date} lastUpdate - Event last update
   * @param {boolean} deleted - Event deleted
   */
  constructor(id, title, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Event} Entity instance
   */
  static fromJson(json) {
    return new Event(json.id, json.title, json.iso, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Title
   */
  get Title() {
    return this.title;
  }
}

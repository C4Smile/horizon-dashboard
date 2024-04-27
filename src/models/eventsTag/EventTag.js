import { Entity } from "../entity/Entity";

/**
 * @class EventTag
 * @description Represents a eventTag
 */
export class EventTag extends Entity {
  name = "";

  /**
   * @param {number} id - EventTag id
   * @param {string} name - EventTag name
   * @param {Date} dateOfCreation - EventTag date of creation
   * @param {Date} lastUpdate - EventTag last update
   * @param {boolean} deleted - EventTag deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {EventTag} Entity instance
   */
  static fromJson(json) {
    return new EventTag(
      json.id,
      json.name,
      json.iso,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}

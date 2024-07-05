import { Entity } from "../entity/Entity";

/**
 * @class Tag
 * @description Represents a tag
 */
export class Tag extends Entity {
  name = "";

  /**
   * @param {number} id - Tag id
   * @param {string} name - Tag name
   * @param {Date} dateOfCreation - Tag date of creation
   * @param {Date} lastUpdate - Tag last update
   * @param {boolean} deleted - Tag deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Tag} Entity instance
   */
  static fromJson(json) {
    return new Tag(json.id, json.name, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}

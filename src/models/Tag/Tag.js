import { Entity } from "../entity/Entity";

/**
 * @class NewsTag
 * @description Represents a newsTag
 */
export class Tag extends Entity {
  name = "";

  /**
   * @param {number} id - NewsTag id
   * @param {string} name - NewsTag name
   * @param {Date} dateOfCreation - NewsTag date of creation
   * @param {Date} lastUpdate - NewsTag last update
   * @param {boolean} deleted - NewsTag deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {NewsTag} Entity instance
   */
  static fromJson(json) {
    return new Tag(json.id, json.name, json.iso, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
